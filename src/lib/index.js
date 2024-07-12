
export async function loadData () {
    const res = await fetch(`https://data.bsky.cz/bundle.json`);
	const data = await res.json();
    return data
}

export function richText(text, maxLength = 50) {
    // Regex for URLs (with or without http/https, including those with hash)
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-zA-Z0-9()]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    
    // Regex for Bluesky mentions (e.g., @username.domain)
    const blueskyMentionRegex = /@([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+)/g;
    
    // Regex for X mentions (e.g., @username without a dot)
    const xMentionRegex = /@([a-zA-Z0-9_]+)(?![._-])/g;
    
    // Regex for Fediverse mentions (e.g., @username@instance.com)
    const fediverseMentionRegex = /@?([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g;

    // Regex for hashtags (includes Unicode characters)
    const hashtagRegex = /(?<!\S)#(\p{L}\p{M}*(?:\p{L}\p{M}*|[0-9_])*)/gu;

    // Array to store replaced elements
    const replacements = [];

    // Replace Fediverse mentions
    text = text.replace(fediverseMentionRegex, (match, username, instance) => {
      const replacement = `<a href="https://elk.zone/${instance}/@${username}" target="_blank" class="rtl">@${username}@${instance}</a>`;
      replacements.push({original: match, replacement: replacement});
      return `__MENTION_${replacements.length - 1}__`;
    });

    // Replace Bluesky mentions
    text = text.replace(blueskyMentionRegex, (match, handle) => {
      const replacement = `<a href="https://bsky.app/profile/${handle}" target="_blank" class="rtl">@${handle}</a>`;
      replacements.push({original: match, replacement: replacement});
      return `__MENTION_${replacements.length - 1}__`;
    });

    // First, replace URLs to protect them
    text = text.replace(urlRegex, (url) => {
      let href = url.startsWith('http') ? url : `https://${url}`;
      let displayUrl = url.replace(/https?:\/\//g, '').replace(/\/$/, '');
      if (url.length > maxLength) {
        displayUrl = url.substring(0, maxLength - 3) + '...';
      }
      const replacement = `<a href="${href}" target="_blank" class="rtl">${displayUrl}</a>`;
      replacements.push({original: url, replacement: replacement});
      return `__URL_${replacements.length - 1}__`;
    });

    // Replace X mentions
    text = text.replace(xMentionRegex, (match, username) => {
      const replacement = `<a href="https://x.com/${username}" target="_blank" class="rtl">@${username}</a>`;
      replacements.push({original: match, replacement: replacement});
      return `__MENTION_${replacements.length - 1}__`;
    });

    // Replace hashtags
    text = text.replace(hashtagRegex, (match, hashtag) => {
      const encodedHashtag = encodeURIComponent(hashtag);
      const replacement = `<a href="https://bsky.app/hashtag/${encodedHashtag}" target="_blank" class="rtl">#${hashtag}</a>`;
      replacements.push({original: match, replacement: replacement});
      return `__HASHTAG_${replacements.length - 1}__`;
    });

    // Restore all replacements
    replacements.forEach((item, index) => {
      text = text.replace(`__URL_${index}__`, item.replacement);
      text = text.replace(`__MENTION_${index}__`, item.replacement);
      text = text.replace(`__HASHTAG_${index}__`, item.replacement);
    });

    // Regular expression to match long strings but ignore HTML tags
    const regex = new RegExp(`(?<!<[^>]*)\\b\\S{${maxLength+1},}\\b(?![^<]*>)`, 'g');

    text = text.replace(regex, (match) => {
      return `<span style="word-break: break-all;">${match}</span>`;
    });

    return text;
  }

export function getAvatarUrl(u) {
    return u.avatar ? `https://data.bsky.cz/avatars/thumb/${u.did}.avif` : "/avatar.jpg";
  }

export function getUser(users, did) {
    return users.find(u => u.did === did)
  }