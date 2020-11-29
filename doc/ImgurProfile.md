# imgur-profile

This component renders the imgurprofile widget
This widget fetches data from imgur to show stats about imgur
It takes a user parameter which is the user name of the profile

## Props

| Name               | Type     | Description |
| ------------------ | -------- | ----------- |
| `user-id`          | `String` |             |
| `widget-id`        | `String` |             |
| `user-param-prop`  | `String` |             |
| `timer-param-prop` | `String` | &nbsp;      |

## Data

| Name             | Type      | Description | Initial value |
| ---------------- | --------- | ----------- | ------------- |
| `imgurKeys`      | `object`  |             | `{}`          |
| `imgurRequest`   | `object`  |             | `{}`          |
| `requestLoading` | `boolean` |             | `true`        |
| `userParam`      | `string`  |             | `""`          |
| `timerParam`     | `number`  |             | `0`           |
| `initialized`    | `boolean` |             | `false`       |
| `hasService`     | `boolean` |             | `false`       |
| `interval`       | `number`  |             | `0`           |

## Methods

### doRequest()

This function does the request to get informations about the user
Then it stores the api call in the imgurRequest state

**Syntax**

```typescript
async doRequest(): Promise
```

### saveConfig()

This function is used to save the widget configuration

**Syntax**

```typescript
saveConfig(): void
```

### editConfig()

This function is used to change the component to its configuration mode

**Syntax**

```typescript
editConfig(): void
```

### updateFirebase()

This function updates the widget parameters by storing them into firebase
It takes the props and stores them into the widget document

**Syntax**

```typescript
async updateFirebase(): Promise
```

### deleteWidget()

Deletes the widget

**Syntax**

```typescript
deleteWidget(): void
```

