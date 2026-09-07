(() => {
  'use strict';

  const CENTER = 220;
  const EARTH_ORBIT_RADIUS = 154;
  const MOON_ORBIT_RADIUS = 30;
  const normalize = degrees => ((degrees % 360) + 360) % 360;

  function point(degrees, radius) {
    const radians = degrees * Math.PI / 180;
    return { x: radius * Math.sin(radians), y: -radius * Math.cos(radians) };
  }

  function dialPoint(degrees, radius) {
    const offset = point(degrees, radius);
    return { x: CENTER + offset.x, y: CENTER + offset.y };
  }

  function dialScale() {
    return Array.from({ length: 12 }, (_, index) => ({
      month: index + 1, startDegree: index * 30, endDegree: (index + 1) * 30,
      tickStart: dialPoint(index * 30, 126), tickEnd: dialPoint(index * 30, 182),
      degreeLabel: dialPoint(index * 30, 204), monthLabel: dialPoint(index * 30 + 15, 106)
    }));
  }

  function position(longitude, phaseAngle) {
    if (!Number.isFinite(longitude)) throw new TypeError('A finite solar longitude is required.');
    // Year dial: zero at the top, increasing clockwise; the calendar longitude is unchanged.
    const degree = normalize(longitude);
    const earth = point(degree, EARTH_ORBIT_RADIUS);
    // At new moon the satellite is toward the Sun; at full moon, away from it.
    const moon = Number.isFinite(phaseAngle)
      ? point(degree + 180 + phaseAngle, MOON_ORBIT_RADIUS) : null;
    return { degree, month: Math.floor(degree / 30) + 1,
      earth: { x: CENTER + earth.x, y: CENTER + earth.y }, moon };
  }

  const api = Object.freeze({ CENTER, EARTH_ORBIT_RADIUS, MOON_ORBIT_RADIUS, position, dialScale });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalThis.SolarCircleOrbitViewModel = api;
})();
