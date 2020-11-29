# spotify-top

This component renders the spotifytop widget
It takes a type and delay param

## Props

| Name               | Type     | Description |
| ------------------ | -------- | ----------- |
| `user-id`          | `String` |             |
| `widget-id`        | `String` |             |
| `type-prop`        | `Object` |             |
| `delay-prop`       | `Object` |             |
| `timer-param-prop` | `String` | &nbsp;      |

## Data

| Name             | Type      | Description | Initial value                                                                                                                       |
| ---------------- | --------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `spotifyKeys`    | `object`  |             | `{}`                                                                                                                                |
| `spotifyRequest` | `object`  |             | `{}`                                                                                                                                |
| `requestLoading` | `boolean` |             | `true`                                                                                                                              |
| `typeParam`      | `string`  |             | `""`                                                                                                                                |
| `delayParam`     | `string`  |             | `""`                                                                                                                                |
| `timerParam`     | `number`  |             | `0`                                                                                                                                 |
| `initialized`    | `boolean` |             | `false`                                                                                                                             |
| `hasService`     | `boolean` |             | `false`                                                                                                                             |
| `interval`       | `number`  |             | `0`                                                                                                                                 |
| `type`           | `array`   |             | `[ {name: 'Show artists', code: 'artists'}, {name: 'Show tracks', code: 'tracks'}, ]`                                               |
| `delay`          | `array`   |             | `[ {name: 'Long term', code: 'long_term'}, {name: 'Medium term', code: 'medium_term'}, {name: 'Short term', code: 'short_term'}, ]` |

## Methods

### doRequest()

This function does the request to get informations about a user top tracks /
artists

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

