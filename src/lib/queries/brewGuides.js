// src/lib/queries/brewGuides.js
export const guidesForRoaster = `
*[_type == "brewGuide" && archived != true && references($roasterId)]{
  _id, method, ratio, dose, yield, grind, tempC, timeTotal, steps,
  editorStatus, sourceUrl,
  "roaster": roaster->{ _id, name, "imageUrl": image.asset->url }
} | order(method asc, changedAt desc)
`

export const allBrewGuides = `
*[_type == "brewGuide" && archived != true]{
  _id, method, ratio, dose, yield, grind, tempC, timeTotal,
  "roaster": roaster->{ _id, name, "imageUrl": image.asset->url }
} | order(changedAt desc)
`
