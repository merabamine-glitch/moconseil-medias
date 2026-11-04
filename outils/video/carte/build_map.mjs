// Génère src/map_med.ts : chemins SVG (Natural Earth 50m, domaine public) de la Méditerranée, projection Mercator.
import {geoMercator, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import fs from 'fs';
const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const W = 2400, H = 3600;
const proj = geoMercator().center([4.5, 43]).scale(5200).translate([W / 2, H / 2]).clipExtent([[-50, -50], [W + 50, H + 50]]);
const path = geoPath(proj);
const countries = feature(topo, topo.objects.countries).features;
const r = (s) => s ? s.replace(/(\d+\.\d{1})\d+/g, '$1') : '';
const out = {W, H, land: [], algerie: '', europe: []};
const EU = new Set(['250', '756', '056']);
for (const c of countries) {
  const d = r(path(c));
  if (!d) continue;
  if (c.id === '012') out.algerie = d;
  else if (EU.has(c.id)) out.europe.push(d);
  else out.land.push(d);
}
const P = (lon, lat) => proj([lon, lat]).map((v) => Math.round(v));
out.villes = {alger: P(3.06, 36.75), paris: P(2.35, 48.86), geneve: P(6.14, 46.2), bruxelles: P(4.35, 50.85)};
fs.writeFileSync('src/map_med.ts', '// Généré par carte/build_map.mjs — Natural Earth 50m (domaine public)\nexport const MAP = ' + JSON.stringify(out) + ' as const;\n');
console.log(out.villes, fs.statSync('src/map_med.ts').size);
