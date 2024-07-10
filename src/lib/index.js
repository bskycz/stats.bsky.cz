// place files you want to import through the `$lib` alias in this folder.

/*import data from '../../../country-list/dist/data.json'
export {
    data
}*/

export async function loadData () {
    const res = await fetch(`https://data.bsky.cz/index.json`);
	const data = await res.json();
    return data
}
