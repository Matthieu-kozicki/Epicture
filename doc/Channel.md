# ytb

This component renders the channel widget
It takes a channel name param

## Props

| Name                | Type     | Description |
| ------------------- | -------- | ----------- |
| `user-id`           | `String` |             |
| `widget-id`         | `String` |             |
| `channel-name-prop` | `String` |             |
| `timer-param-prop`  | `String` | &nbsp;      |

## Data

| Name               | Type      | Description | Initial value |
| ------------------ | --------- | ----------- | ------------- |
| `channelRequest`   | `object`  |             | `{}`          |
| `subsRequest`      | `object`  |             | `{}`          |
| `okayRequest`      | `boolean` |             | `false`       |
| `requestLoading`   | `boolean` |             | `true`        |
| `channelNameParam` | `string`  |             | `""`          |
| `timerParam`       | `number`  |             | `0`           |
| `initialized`      | `boolean` |             | `false`       |
| `hasService`       | `boolean` |             | `false`       |
| `interval`         | `number`  |             | `0`           |

## Methods

### doRequest()

This function does the request to get informations about a channel

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

