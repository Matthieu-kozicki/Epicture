# dashboard

# Project details

This project was made by Matthieu Kozicki and Yoan Saint Juste
Tek 3 Promo 2023

# Git

Norm of commit used : [BRANCH][ACTION with verbs] Commit description

##### Example of commits used
[BRANCH] | [ACTION] | Description
------------ | ------------- | ------------
[TEST]|[ADD]| Image display for search page |
[TEST]|[MOD]| file
[TEST]|[FIXED]| an issue
[MASTER]|[INIT]| Branch test

##### Commits from ```git shortlog```
```bash
 [TEST][ADD] Image display for search page
 [TEST][ADD] Styles.js file with colors
 [TEST][FIXED] Issue in settings and added videos in CardDisplayer Modal
```

# Usage

```bash
docker-compose build && docker-compose up
```

Then you can go to localhost:8081 on your browser.
And localhost:8080/about.json to get the json file.

# Documentation

### Pages

The project is organised in multiple pages, the main page is the Dashboard one.

* [Dashboard page](/doc/Dashboard.md)
* [Login page](/doc/Login.md)
* [Admin page](/doc/Admin.md) and [Admin widget](/doc/AdminWidget.md)
* [Service page](/doc/Service.md)

### Widgets

Here are all the widgets for the Dashboard

#### Imgur

* [Profile widget](/doc/ImgurProfile.md)
* [Search widget](/doc/ImgurSearch.md)

#### Spotify

* [Profile widget](/doc/SpotifyProfile.md)
* [Artist widget](/doc/SpotifyArtist.md)

#### Youtube

* [Channel widget](/doc/Channel.md)

#### Currency

* [Currency widget](/doc/Currency.md)

#### Weather

* [City widget](/doc/WeatherCity.md)

