# social-profiles

_Special thanks to [@cnrad](https://github.com/cnrad/) for creating [this project](https://lanyard.cnrad.dev/), it's my inspiration for this project._

## Usage
First, go to this [website](https://social-profiles.tiaansu.vercel.app/) and login your google account.

You have two options to share your social profiles, first is by adding it in your `README.md` file and by adding it in your bio.

- For adding in your `README.md`, copy this and replace `:userId` with your userId (found on the [website](https://social-profiles.tiaansu.vercel.app/)).
```md
[![Discord Presence](https://social-profiles.tiaansu.vercel.app/api/social-profiles/:id/github)](https://social-profiles.tiaansu.vercel.app/)
```

It should display something similar to the following:

[![Discord Presence](https://social-profiles.tiaansu.vercel.app/api/social-profiles/656aca4fdb892d8b7029c5f8/github)](https://github.com/Tiaansu)

- For adding in your bio, copy this and replace `:userId` with your userId (found on the [website](https://social-profiles.tiaansu.vercel.app/)).
```md
https://social-profiles.tiaansu.vercel.app/:userId
```

## Options

There are few options to customize this display using query parameters:

- __Theme__
    - Append the query param `theme=:theme` to the end of the URL, replacing `:theme` with either `light` or `dark`. This will change the background and the font colors, but the background can be overridden with the __Background Color__ parameter.

- __Background Color__
    - Append the query param `bg=:bg` to the end of the URL, replacing `:color` with a hex color of your choice ([omit](https://www.merriam-webster.com/dictionary/omit) the #)

- __Border Radius
    - Append the query param `borderRadius=:radius` to the end of the URL, replacing `:radius` with a radius of your choice. (default `10px`)

> [!NOTE]  
> _If you're using this in your profile, feel free to show support and give [this repo](https://github.com/Tiaansu/social-profiles) a ⭐ star! It means a lot, thank you :)_
