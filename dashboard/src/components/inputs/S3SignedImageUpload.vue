<template>
  <div class="ma-5">
    <div v-if="internal">
      <div>
        <v-img :src="getImageUrl(internal)" :key="internal" max-height="200px" max-width="200px" contain class="nice-border"/>
        <p class="text--secondary">{{internal}}</p>
      </div>
      <v-btn fab dark small color="error" @click="clearUpload"><v-icon dark>mdi-close</v-icon></v-btn>
    </div>
    <v-btn :loading="loading" v-if="!internal"><input type="file" accept="image/*" :name="name" @change="fileChange(name, $event)"></v-btn>
  </div>
</template>

<script>
import slugify from 'slugify';
import axios from 'axios';

export default {
  props: ['value', 'name', 'bucketKey', 'options', 'removeImage'],
  data() {
    return {
      loading: false,
      selectedFile: null,
      key: null
    };
  },
  mounted() {
    if (!this.value) this.$emit('update:error', 'Image required');
  },
  methods: {
    async fileChange(name, event) {
      if (event.target.files && event.target.files.length === 1) {
        this.selectedFile = event.target.files[0];

        this.loading = true;
        try {
          const signature = await this.$http.post('/signed-image-upload', { folder: this.bucketKey });
          const formdata = new FormData();
          formdata.append('key', signature.data.fields.key);
          formdata.append('acl', 'public-read');
          formdata.append('Content-Type', this.selectedFile.type);

          // put JSON object on formdata (exclude the file fields)
          Object.keys(signature.data.fields).forEach((key) => {
            if (key !== 'key') {
              const value = signature.data.fields[key];
              formdata.append(key, value);
            }
          });

          const fileName = slugify(this.selectedFile.name, { remove: /[\s$*_+~()'"!:@?]/g });
          formdata.append('file', this.selectedFile, fileName);

          const response = await axios.post(signature.data.url, formdata);
          this.key = signature.data.fields.key.replace('${filename}', fileName);
          this.internal = `${signature.data.url}/${this.key}`;
          if (response.status !== 204) throw new Error('Image Upload Failed');
          this.loading = false;
        } catch (error) {
          console.error(error);
          this.loading = false;
          if (error.response) {
            console.info(error.response);
            this.$emit('update:error', error.response.data.message || JSON.stringify(error.response.status));
          } else {
            this.$emit('update:error', JSON.stringify(error.message) || 'Image Upload Failed');
          }
        }
      }
      return false;
    },
    clearUpload() {
      if (this.removeImage) {
        this.removeImage(this.internal);
      } else {
        this.key = null;
        this.selectedFile = null;
        this.internal = null;
      }
      this.$emit('update:error', 'Image Required');
    },
    getImageUrl(url) {
      if (!url) return url;
      const dev_envs = ['localhost', 'dev', '127.0.0.1'];
      const env = (dev_envs.find(a => window.location.host.includes(a))) ? 'dev': 'production';
      return url.includes('http') ? url : `https://bookings-image-data-${env}.s3.eu-central-1.amazonaws.com/public/${url}`;
    },
  },
  computed: {
    internal: {
      get() {
        return this.value;
      },
      set(newValue) {
        // When the internal value changes, we $emit an event. Because this event is
        // named 'input', v-model will automatically update the parent value
        this.$emit('input', newValue);
      }
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.$emit('update:error', '');
      }
    }
  }
};
</script>

<style>
.nice-border {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(209, 219, 229);
  border-image: initial;
  border-radius: 4px;
}
</style>
