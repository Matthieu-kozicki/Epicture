# Dashboard

Main component of our application, the Dashboard renders
all widgets and informations about the currently connected user

## Data

| Name       | Type     | Description | Initial value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `user`     | `object` |             | `{}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `userData` | `object` |             | `{"imgurService":{"type":"boolean","value":false,"raw":"false"},"spotifyService":{"type":"boolean","value":false,"raw":"false"},"steamService":{"type":"boolean","value":false,"raw":"false"},"weatherService":{"type":"boolean","value":false,"raw":"false"},"currencyService":{"type":"boolean","value":false,"raw":"false"},"youtubeService":{"type":"boolean","value":false,"raw":"false"},"displayName":{"type":"string","value":"","raw":"\"\""},"profilePic":{"type":"string","value":"","raw":"\"\""},"widgets":{"type":"array","value":"[]","raw":"[]"}}` |
| `items`    | `array`  |             | `[ { label: 'Imgur', icon:'pi pi-fw pi-images', items: [] }, { label: 'Spotify', icon:'pi pi-fw pi-volume-up', items: [] }, { label: 'Weather', icon:'pi pi-fw pi-cloud', items: [] }, { label: 'Currency', icon:'pi pi-fw pi-money-bill', items: [] }, { label: 'Youtube', icon: 'pi pi-fw pi-video', items: [] }, ]`                                                                                                                                                                                                                                             |

## Methods

### disconnect()

Method to disconnect the currently connected user

**Syntax**

```typescript
disconnect(): void
```

### imgurRegister()

This function allows the user to register to the imgur service

**Syntax**

```typescript
imgurRegister(): void
```

### unregisterService()

This function allows the user to unregister from a service
it accepts a serviceName param which is the name of the service

**Syntax**

```typescript
unregisterService(serviceName: unknow): void
```

### getWidgets()

This function is used to get the widgets of the currently connected user

**Syntax**

```typescript
getWidgets(): void
```

### getServices()

This function is used to get the services of the currently connected user

**Syntax**

```typescript
getServices(): void
```

