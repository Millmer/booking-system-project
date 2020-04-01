
# Booking Admin Dashboard (CMS)

Dashboard for the Booking system

Uses [Vuetify](https://vuetifyjs.com/en) as for base components

Set up with [VueCLI](https://cli.vuejs.org/config/).

Auth is currently a custom JWT flow. It was originally using AWS Cognito and so the Auth module can be easily swapped out and replaced by the `AWS Amplify` Cognito package.

Connection environment is managed through checking the current browser URL, this avoids the need for env vars on the FE.

## CRUD
Basic rapid development CRUD components are found in the `@/src/components/crud` folder. They include
- List.vue
- Create.vue
- Edit.vue
- Delete.vue
- Field.vue

Using these allows for rapid development of CRUD interfaces by providing basic configuration such as the resource endpoint, the fields and their types and custom configuration such as RegEx validation rules and IAM permission visiblity. Take a look in the views folder to see an example setup (locations sub-folder for example).

List and action slots can be overridden for even more flexibility and custom detail views may be provided. Custom CRUD fields can easily be extended by creating new components in `@/src/inputs` folder.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Wishlist
- Add more default input fields for CRUD actions
- Add global API error catcher and notification system