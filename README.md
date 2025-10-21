# Politician List
Ever find yourself wondering when a senator is up for re-election, or what state or even what party a representative is from? You can do a web search on each one or you can just check this list. You can see the app by going to [politicianlist.com](https://politicianlist.com/ "Politicianlist").

This is a small React app that was built with [Bootstrap](https://getbootstrap.com/ "Bootstrap"). It gives you a list of all current members of the 119th Congress. You can filter and sort the list, and scroll through for basic information. The data used to come from [ProPublica's Congress API](https://projects.propublica.org/api-docs/congress-api/ "ProPublica's Congress API") but they discontinued it. Fortunately, Congress provides [their own API](https://api.congress.gov/ "Congress.gov API"). I switched to that and rebuilt the whold thing.

The photos come from [this repository](https://github.com/unitedstates/images/ "Open source images of members of Congress"). It's a public domain collection of congressional photos that's open for public use. There are some missing photos, so I'm adding my own fallback images.

It's a simple little app, and unfortunately I'm working all the time these days so I don't have much time to tinker. I'll refresh the data on a regular basis, though. This new version works from a text data file that I build with Node scripts. That way I won't be worried about rate limits or even a shutdown of the API itself. If the thing gets pulled, I can update the data another way.

The repo for generating the data is called [Gather Congress](https://github.com/briancribb/gather-congress). 
 

## Important Note
This is mentioned in the filter modal in the app, but I don't mind saying it twice. Since representatives are up for re-election every two years, filtering by the election year eliminates the House from the list. Otherwise the senators you're looking for would be mixed in with hundreds of representatives