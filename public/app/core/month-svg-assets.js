(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const tags = ['svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'title', 'desc'];
  const attrs = ['viewBox', 'd', 'points', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'width', 'height',
    'fill', 'stroke', 'stroke-width', 'fill-rule', 'clip-rule', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'fill-opacity', 'stroke-opacity', 'transform', 'xmlns'];
  const numberPattern = /[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g;
  const size = text => new TextEncoder().encode(text).length;
  function numbers(text, count) {
    const tokens = text.match(numberPattern) || [];
    if (text.replace(numberPattern, '').replace(/[\s,]/g, '') || !tokens.length || (count && tokens.length !== count)) throw new Error('Invalid SVG numbers.');
    const values = tokens.map(Number);
    if (values.some(value => !Number.isFinite(value) || Math.abs(value) > 1e6)) throw new Error('SVG coordinates out of range.');
    return values;
  }
  function parse(text) {
    if (typeof text !== 'string' || !text.length || size(text) > 32768 || /<!DOCTYPE|<!ENTITY|<\?/i.test(text)) throw new Error('Invalid SVG file or size.');
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    if (doc.querySelector('parsererror') || doc.doctype || doc.documentElement.localName !== 'svg' || doc.documentElement.namespaceURI !== NS) throw new Error('Invalid SVG XML.');
    const viewBox = numbers(doc.documentElement.getAttribute('viewBox') || '', 4);
    if (viewBox[2] <= 0 || viewBox[3] <= 0) throw new Error('Invalid SVG viewBox.');
    let nodes = 0, pathChars = 0, transformChars = 0, shapes = 0;
    function inspect(el, depth) {
      if (++nodes > 256 || depth > 16 || el.namespaceURI !== NS || !tags.includes(el.localName) || el.prefix
        || (el.localName === 'svg' && el !== doc.documentElement)) throw new Error('Unsupported SVG structure.');
      if (!['svg', 'g', 'title', 'desc'].includes(el.localName)) shapes++;
      for (const attribute of el.attributes) {
        const name = attribute.name, value = attribute.value;
        if (!attrs.includes(name) || (attribute.namespaceURI && name !== 'xmlns')) throw new Error('Unsupported SVG attribute.');
        if (name === 'xmlns') { if (value !== NS || el !== doc.documentElement) throw new Error('Unsupported namespace.'); continue; }
        if (name === 'fill' || name === 'stroke') {
          if (!/^(?:none|transparent|currentColor|#[a-f\d]{3}|#[a-f\d]{4}|#[a-f\d]{6}|#[a-f\d]{8}|[a-z]{1,20})$/i.test(value)
            || !CSS.supports('color', value === 'none' ? 'transparent' : value)) throw new Error('Unsupported SVG color.');
        } else if (name === 'd') {
          pathChars += value.length;
          if (pathChars > 24576 || /[^MmLlHhVvCcSsQqTtAaZzEe\d\s.,+\-]/.test(value)) throw new Error('Invalid SVG path.');
          const numeric = value.replace(/[MmLlHhVvCcSsQqTtAaZz]/g, ' ');
          numbers(numeric);
        } else if (name === 'transform') {
          transformChars += value.length;
          if (transformChars > 2048) throw new Error('SVG transforms too large.');
          const functions = [...value.matchAll(/(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^()]*)\)/g)];
          if (!functions.length || value.replace(/(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^()]*)\)/g, '').trim()) throw new Error('Invalid SVG transform.');
          for (const match of functions) {
            const n = numbers(match[2]).length;
            if (!({ matrix: [6], translate: [1, 2], scale: [1, 2], rotate: [1, 3], skewX: [1], skewY: [1] })[match[1]].includes(n)) throw new Error('Invalid transform arity.');
          }
        } else if (['fill-rule', 'clip-rule'].includes(name)) {
          if (!['nonzero', 'evenodd'].includes(value)) throw new Error('Invalid fill rule.');
        } else if (name === 'stroke-linecap') {
          if (!['butt', 'round', 'square'].includes(value)) throw new Error('Invalid line cap.');
        } else if (name === 'stroke-linejoin') {
          if (!['miter', 'round', 'bevel'].includes(value)) throw new Error('Invalid line join.');
        } else {
          const values = numbers(value, name === 'points' ? undefined : name === 'viewBox' ? 4 : 1);
          if (name === 'points' && values.length % 2) throw new Error('Invalid SVG points.');
          if (['r', 'rx', 'ry', 'width', 'height', 'stroke-width'].includes(name) && values[0] < 0) throw new Error('Negative SVG dimension.');
          if (['opacity', 'fill-opacity', 'stroke-opacity'].includes(name) && (values[0] < 0 || values[0] > 1)) throw new Error('Invalid opacity.');
        }
      }
      for (const child of el.childNodes) {
        if (child.nodeType === 1) inspect(child, depth + 1);
        else if (![3, 8].includes(child.nodeType)) throw new Error('Unsupported SVG node.');
        else if (child.nodeType === 3 && child.textContent.trim() && !['title', 'desc'].includes(el.localName)) throw new Error('Unsupported SVG text.');
      }
    }
    inspect(doc.documentElement, 1);
    if (!shapes) throw new Error('SVG has no shapes.');
    return { doc, viewBox };
  }
  function sanitize(text) {
    parse(text);
    if (!globalThis.DOMPurify?.isSupported) throw new Error('SVG sanitizer unavailable.');
    const clean = DOMPurify.sanitize(text, { ALLOWED_TAGS: tags, ALLOWED_ATTR: attrs,
      ALLOW_DATA_ATTR: false, ALLOW_ARIA_ATTR: false, PARSER_MEDIA_TYPE: 'application/xhtml+xml' });
    const { doc, viewBox } = parse(clean);
    const svg = new XMLSerializer().serializeToString(doc.documentElement);
    if (size(svg) > 32768) throw new Error('SVG too large.');
    return { svg, viewBox };
  }
  async function hash(text) {
    return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))].map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
  async function importSvg(text, now = new Date().toISOString()) {
    const { svg, viewBox } = sanitize(text);
    return { id: await hash(svg), kind: 'custom-svg', sanitizedSvg: svg, utf8Bytes: size(svg), viewBox,
      sanitizerPolicyVersion: 'month-svg-v1', importedAt: now };
  }
  async function validateAsset(asset) {
    if (asset.sanitizerPolicyVersion !== 'month-svg-v1' || asset.kind !== 'custom-svg') throw new Error('Unknown SVG policy.');
    const result = await importSvg(asset.sanitizedSvg, asset.importedAt);
    if (asset.id !== result.id || asset.utf8Bytes !== result.utf8Bytes || JSON.stringify(asset.viewBox) !== JSON.stringify(result.viewBox)) throw new Error('SVG hash or geometry mismatch.');
    return result;
  }
  globalThis.SolarCircleMonthSvgAssets = Object.freeze({ importSvg, validateAsset });
})();
