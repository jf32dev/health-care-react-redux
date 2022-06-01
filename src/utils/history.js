import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

let pastLocations = [];
function updatePastLocations(location, action) {
  switch (action) {
    case 'PUSH':
      // first location when app loads and when pushing onto history
      pastLocations.push(location);
      break;
    case 'REPLACE':
      // only when using history.replace
      pastLocations[(pastLocations.length || 1) - 1] = location;
      break;
    case 'POP': {
      // happens when using the back button, or forward button
      pastLocations.pop();
      // location according to pastLocations
      const appLocation = pastLocations[pastLocations.length - 1];
      if (!(appLocation && appLocation.key === location.key)) {
        // If the current location doesn't match what the app thinks is the current location,
        // blow up the app history.
        pastLocations = [location];
      }
      break;
    }
    default:
  }
}
history.listen(updatePastLocations);

function isPreviousLocationWithinApp() {
  return pastLocations.length > 1;
}

export function goBackOrReplace(location, state) {
  if (isPreviousLocationWithinApp()) {
    history.goBack();
  } else {
    history.replace(location, state);
  }
}