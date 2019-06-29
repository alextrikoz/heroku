![](https://avatars3.githubusercontent.com/u/251374?s=75&v=4)

# Spotify Token Swap Example 🔑 ⛓ on Glitch 🎏

## Intro

For iOS, Android, and static web apps, in order to support the [Authorization Code Flow][authorization-code-flow] securely - you need a server which performs the token swap.

This Glitch is designed for development and exploration purposes. We don't expect production-level apps to remix this and use it as their token swapping service. You should host it outside of Glitch for such uses.

[Read more about token swapping on Spotify for Developers](https://beta.developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow).

## Setup

Visit your [Developer Dashboard](https://beta.developer.spotify.com/dashboard/) and perform the following steps:
1. Create an application
2. Collect your Client ID, and paste it into your `.env` under `SPOTIFY_CLIENT_ID`
3. Collect your Client Secret, and paste it into your `.env` under `SPOTIFY_CLIENT_SECRET`
4. Click Settings, and add a callback URL (this would be your iOS/Android callback protocol, or your static site, not your Glitch project) and click Save
5. Copy the callback URL, and paste into your `.env` under `SPOTIFY_CLIENT_CALLBACK_URL`

## APIs

It exposes two endpoints:

**POST /api/token**

The `/api/token` endpoint accepts a `code` parameter. This is sent by Spotify when you put `authorization_type=code` in the https://accounts.spotify.com URL you send users to.

cURL Request:

```bash
$ curl -X POST -d "code=[code]" https://spotify-token-swap.glitch.me/api/token
```

`200 OK` Response Sample:

```json
{
  "access_token":
    "BQDjrNCJ66N1utnFnpgcPZy8yD8KSsGN_zC1qP6jg1xeWfCl_slv8LGig_ia8bHynxFuSs-PvmHp-_6U13cBPR8469s66KmWxxdOsHCN00Gg5AgX3wyZYJLX0V-HqiXqCNdzDVShlzFaPEHJbKbm73TWJDHTG4c",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "p7jJ+3agZ8m9aBMZdiTq85wqNIl16ctbMgCPFOlRBanVgB+kht2hDmrCDL5V\nvRFQS9s1vBsWkpBCC0kbA6srol8NrKaHzY1tNrvDRFoN7xumQId8agd6Tqs6\nM8ypEhvTDElFbt1cMxd+N3z0JG3gSmOPk2h8/idwVBub0cqyCSacf4GPpnwW\nCg==\n",
  "scope": "user-read-private"
}
```

`402 Bad Request` Response Sample:

```json
{
  "error": "invalid_grant",
  "error_description": "Invalid authorization code"
}
```


**POST /api/refresh_token**

The `/api/refresh_token` endpoint accepts a `refresh_token` parameter. This exists in the payload from the `/api/token` endpoint above. You should store that and call it every 60 minutes (the fixed expiry for an access token) to generate a new access token.

Sample request:

```bash
$ curl -X POST -d "refresh_token=[refresh token]" https://spotify-token-swap.glitch.me/api/refresh_token
```

`200 OK` Response Sample:

```json
{
  "access_token":
    "BQCjHuWkG2pSAFaa7-zQJQWjylilINTpUbfRbRgJtAMJrBF9h3vg-N6bnaG9XCKYE8ceAsGgTGwbeO8MfbZKlYbyHG4B7EOeIUlTo0wn08PgkQZGjBzMYQwzNwr_pmel4pCgKOiEyH9Zc8L6iss3anLSSg6IWag",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "user-read-private"
}
```

`402 Bad Request` Response Sample:

```json
{
  "error": "invalid_grant",
  "error_description": "Invalid refresh token"
}
```

# Ending Notes

For a more advanced, tested, and production-level version, we recommend checking out our [spotify-token-swap-service project on GitHub](https://github.com/bih/spotify-token-swap-service).


[authorization-code-flow]: https://beta.developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow