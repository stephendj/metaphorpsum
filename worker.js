const nouns = [
  "love", "truth", "time", "life", "death", "hope", "fire", "ocean",
  "shadow", "mirror", "storm", "silence", "dream", "light", "darkness",
  "river", "mountain", "wind", "soul", "heart", "mind", "war", "peace",
  "hunger", "memory", "fear", "joy", "chaos", "order", "dust"
];

const adjectives = [
  "fragile", "endless", "hollow", "bitter", "ancient", "restless",
  "golden", "broken", "silent", "burning", "fleeting", "heavy",
  "distant", "cold", "tender", "wild", "blind", "empty", "pale", "dark"
];

const templates = [
  "{nouns} are the {noun} of {nouns}.",
  "The {noun} of {nouns} is a {adjective} {noun}.",
  "{a_noun} is {an_adjective} {noun} of {nouns}.",
  "Life is {an_adjective} {noun}, and {nouns} are its {noun}.",
  "{nouns} are just {adjective} {nouns} waiting to be {adjective}.",
  "The {adjective} {noun} of {nouns} is {an_adjective} {noun}.",
  "{a_noun} without {nouns} is just {an_adjective} {noun}.",
  "We are all {adjective} {nouns} in a {adjective} {noun}.",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function noun() { return pick(nouns); }
function adjective() { return pick(adjectives); }
function a_noun() {
  const n = noun();
  return /^[aeiou]/.test(n) ? `an ${n}` : `a ${n}`;
}
function an_adjective() {
  const a = adjective();
  return /^[aeiou]/.test(a) ? `an ${a}` : `a ${a}`;
}

function makeSentence() {
  return pick(templates)
    .replace(/{an_adjective}/g, an_adjective)
    .replace(/{a_noun}/g, a_noun)
    .replace(/{adjective}/g, adjective)
    .replace(/{nouns}/g, () => noun() + 's')
    .replace(/{noun}/g, noun);
}

function makeParagraph(numSentences) {
  return Array.from({ length: numSentences }, makeSentence).join(' ');
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const headers = { 'Content-Type': 'text/plain; charset=utf-8' };

    if (parts[0] === 'sentences') {
      const n = Math.min(parseInt(parts[1]) || 1, 50);
      const result = Array.from({ length: n }, makeSentence).join('\n');
      return new Response(result, { headers });
    }

    if (parts[0] === 'paragraphs') {
      const numParagraphs = Math.min(parseInt(parts[1]) || 1, 20);
      const numSentences = Math.min(parseInt(parts[2]) || 5, 20);
      const paragraphs = Array.from({ length: numParagraphs }, () =>
        makeParagraph(numSentences)
      );
      return new Response(paragraphs.join('\n\n'), { headers });
    }

    return new Response(
      `Metaphorpsum API\n\n/sentences/:n\n/paragraphs/:n\n/paragraphs/:n/:sentences`,
      { headers }
    );
  },
};