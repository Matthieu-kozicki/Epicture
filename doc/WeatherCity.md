# weather-city

This component renders the weathercity widget
It takes a city param

## Props

| Name               | Type     | Description |
| ------------------ | -------- | ----------- |
| `user-id`          | `String` |             |
| `widget-id`        | `String` |             |
| `city-prop`        | `String` |             |
| `timer-param-prop` | `String` | &nbsp;      |

## Data

| Name             | Type      | Description | Initial value |
| ---------------- | --------- | ----------- | ------------- |
| `weatherRequest` | `object`  |             | `{}`          |
| `requestLoading` | `boolean` |             | `true`        |
| `cityParam`      | `string`  |             | `""`          |
| `timerParam`     | `number`  |             | `0`           |
| `initialized`    | `boolean` |             | `false`       |
| `hasService`     | `boolean` |             | `false`       |
| `interval`       | `number`  |             | `0`           |

## Methods

### doRequest()

This function does the request to get the meteo about a city

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

