# Politicianlist
Ever find yourself wondering when a senator is up for re-election, or what state or even what party a representative is from? You can do a web search on each one or you can just check this list. You can see the app by going to [politicianlist.com](https://politicianlist.com/ "Politicianlist") or just go to the project page directly at the [https://briancribb.github.io/politicianlist/](https://briancribb.github.io/politicianlist/ "Politicianlist Project Page").

This is a small React app that was built with [Bootstrap](https://getbootstrap.com/ "Bootstrap") and gives you a list of all current members of the 117th Congress. You can filter and sort the list, and scroll through for basic information. The data comes from [ProPublica's Congress API](https://projects.propublica.org/api-docs/congress-api/ "ProPublica's Congress API") and the photos come from [this repository](https://github.com/unitedstates/images/ "Open source images of members of Congress"). It's a public domain collection of congressional photos that's open for public use. There are some missing photos, so I'm adding my own fallback images.

The app is pretty simple at the moment, but I'll add more features as I go. I wanted to publish the app when I got it working, because if I wait until it's perfect then I'll be tinkering forever and no one will ever see it.   :-)

## Important Note
This is mentioned in the filter modal in the app, but I don't mind saying it twice. Since representatives are up for re-election every two years, filtering by the election year eliminates the House from the list. Otherwise the senators you're looking for would be mixed in with hundreds of representatives.
