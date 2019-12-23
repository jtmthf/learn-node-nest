import * as datefns from 'date-fns';
import * as fs from 'fs';
import * as _ from 'lodash';

export function dump(obj: any) {
  return JSON.stringify(obj, null, 2);
}

export function staticMap([lng, lat]: [number, number]) {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${
    process.env.MAP_KEY
  }&markers=${lat},${lng}&scale=2`;
}

export const icon = (name: string) =>
  fs.readFileSync(`./public/images/icons/${name}.svg`);

export const siteName = `Now That's Delicious!`;

export const menu = [
  { slug: '/stores', title: 'Stores', icon: 'store' },
  { slug: '/tags', title: 'Tags', icon: 'tag' },
  { slug: '/top', title: 'Top', icon: 'top' },
  { slug: '/add', title: 'Add', icon: 'add' },
  { slug: '/map', title: 'Map', icon: 'map' },
];

export { datefns, _ };
