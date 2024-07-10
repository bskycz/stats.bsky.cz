

export async function load({ fetch, params }) {
	const res = await fetch(`https://data.bsky.cz/data.json`);
	const data = await res.json();

	return data;
}