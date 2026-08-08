import { getDistance } from 'geolib';

export const distanceInMeters = (pointA, pointB) =>
  getDistance(
    { latitude: pointA.lat, longitude: pointA.lng },
    { latitude: pointB.lat, longitude: pointB.lng }
  );

export const findNearbyUsers = async (Model, lng, lat, maxDistanceMeters = 3000) =>
  Model.find({
    lastKnownLocation: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: maxDistanceMeters,
      },
    },
  });
