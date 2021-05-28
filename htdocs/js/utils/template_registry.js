function findBestMatch(set, ...args) {
  const tasks = [];

  set.forEach((component, tagName) => {
    tasks.push(
      (async () => {
        return await component.match(...args);
      })().then((score) => [ tagName, score ])
    );
  });

  return Promise.allSettled(tasks).then((results) => {
    const matches = results.filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    let bestMatch = null;
    let bestScore = -1;

    matches.forEach(([ tagName, score ]) => {
      if (score <= bestScore)
        return;

      bestScore = score;
      bestMatch = tagName;
    });

    return bestMatch;
  });
}

export class TemplateRegistry
{
  constructor(prefix) {
    this.prefix = prefix;
    this.templates = new Map();
  }

  register(name, component) {
    const tagName = this.prefix + '-' + name;

    if (this.templates.has(tagName))
      throw new Error(`Component with name ${tagName} already defined.`)

    customElements.define(tagName, component);
    this.templates.set(tagName, component);
  }

  find(...args) {
    return findBestMatch(this.templates, ...args);
  }
}
