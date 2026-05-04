import Sentencer from 'sentencer';

function makeSentence() {
  const templates = [
    "{{ nouns }} are the {{ noun }} of {{ nouns }}.",
    "The {{ noun }} of {{ nouns }} is a {{ adjective }} {{ noun }}.",
    "{{ a_noun }} is {{ an_adjective }} {{ noun }} of {{ nouns }}.",
    "Life is {{ an_adjective }} {{ noun }}, and {{ nouns }} are its {{ noun }}.",
    "{{ nouns }} are just {{ adjective }} {{ nouns }} waiting to be {{ adjective }}.",
  ];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return Sentencer.make(template);
}

function makeParagraph(numSentences) {
  const sentences = [];
  for (let i = 0; i < numSentences; i++) {
    sentences.push(makeSentence());
  }
  return sentences.join(' ');
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const headers = { 'Content-Type': 'text/plain; charset=utf-8' };

    // /sentences/:n
    if (parts[0] === 'sentences') {
      const n = Math.min(parseInt(parts[1]) || 1, 50);
      const result = Array.from({ length: n }, makeSentence).join('\n');
      return new Response(result, { headers });
    }

    // /paragraphs/:n or /paragraphs/:n/:sentences
    if (parts[0] === 'paragraphs') {
      const numParagraphs = Math.min(parseInt(parts[1]) || 1, 20);
      const numSentences = Math.min(parseInt(parts[2]) || 5, 20);
      const paragraphs = Array.from({ length: numParagraphs }, () =>
        makeParagraph(numSentences)
      );
      return new Response(paragraphs.join('\n\n'), { headers });
    }

    // root — usage info
    return new Response(
      `Metaphorpsum API\n\n/sentences/:n\n/paragraphs/:n\n/paragraphs/:n/:sentences`,
      { headers }
    );
  },
};
