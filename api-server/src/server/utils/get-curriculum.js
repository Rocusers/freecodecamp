import { flatten, omit } from 'lodash';

// TODO: keeping curriculum in memory is handy if we want to field requests that
// need to 'query' the curriculum, but if we force the client to handle
// redirectToCurrentChallenge and, instead, only report the current challenge id
// via the user object, then we should *not* store this so it can be garbage
// collected.

// eslint-disable-next-line import/no-unresolved
import curriculum from '../../../../config/curriculum.json';

export function getChallenges() {
  return Object.keys(curriculum)
    .map(key => curriculum[key].blocks)
    .reduce((challengeArray, superBlock) => {
      const challengesForBlock = flatten(
        Object.keys(superBlock).map(key => superBlock[key].challenges)
      ).map(challenge => ({
        ...omit(challenge, 'challengeId'),
        // challengeId is used by the client, but the api expects to work with
        // id
        id: challenge.challengeId
      }));

      return [...challengeArray, ...challengesForBlock];
    }, []);
}
