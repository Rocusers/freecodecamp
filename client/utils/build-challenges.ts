/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import _ from 'lodash';

import { getChallengesForLang, createChallenge, challengesDir, getChallengesDirForLang } from '../../curriculum/getChallenges';
import envData from '../../config/env.json';

const { curriculumLocale } = envData;

exports.localeChallengesRootDir = getChallengesDirForLang(curriculumLocale);

exports.replaceChallengeNode = () => {
  return async function replaceChallengeNode(filePath: any) {
    return await createChallenge(challengesDir, filePath, curriculumLocale);
  };
};

exports.buildChallenges = async function buildChallenges() {
  const curriculum = await getChallengesForLang(curriculumLocale);
  const superBlocks = Object.keys(curriculum);
  const blocks = superBlocks
    .map(superBlock => curriculum[superBlock].blocks)
    .reduce((blocks, superBlock) => {
      const currentBlocks = Object.keys(superBlock).map(key => superBlock[key]);
      return blocks.concat(_.flatten(currentBlocks));
    }, []);

  const builtChallenges = blocks
    .filter((block: any) => !block.isPrivate)
    .map(({ challenges }: any) => challenges)
    .reduce((accu: any, current: any) => accu.concat(current), []);
  return builtChallenges;
};
