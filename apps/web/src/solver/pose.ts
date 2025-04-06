import { calcArms } from './calcArms';
import { calcHips } from './calcHips';
import { calcLegs } from './calcLegs';
import type { TFVectorPose } from './types';
import { RestingDefault } from './utils/helpers';

export function solve(worldLm: TFVectorPose, localLm: TFVectorPose) {
  const Arms = calcArms(worldLm);
  const Hips = calcHips(worldLm, localLm);
  const Legs = calcLegs(worldLm);

  //DETECT OFFSCREEN AND RESET VALUES TO DEFAULTS
  const rightHandOffscreen =
    worldLm[15].y > 0.1 ||
    (worldLm[15].visibility ?? 0) < 0.23 ||
    0.995 < localLm[15].y;
  const leftHandOffscreen =
    worldLm[16].y > 0.1 ||
    (worldLm[16].visibility ?? 0) < 0.23 ||
    0.995 < localLm[16].y;

  const leftFootOffscreen =
    worldLm[23].y > 0.1 ||
    (worldLm[23].visibility ?? 0) < 0.63 ||
    Hips.Hips.position.z > -0.4;
  const rightFootOffscreen =
    worldLm[24].y > 0.1 ||
    (worldLm[24].visibility ?? 0) < 0.63 ||
    Hips.Hips.position.z > -0.4;

  Arms.UpperArm.l = Arms.UpperArm.l.multiply(leftHandOffscreen ? 0 : 1);
  Arms.UpperArm.l.z = leftHandOffscreen
    ? RestingDefault.Pose.LeftUpperArm.z
    : Arms.UpperArm.l.z;
  Arms.UpperArm.r = Arms.UpperArm.r.multiply(rightHandOffscreen ? 0 : 1);
  Arms.UpperArm.r.z = rightHandOffscreen
    ? RestingDefault.Pose.RightUpperArm.z
    : Arms.UpperArm.r.z;

  Arms.LowerArm.l = Arms.LowerArm.l.multiply(leftHandOffscreen ? 0 : 1);
  Arms.LowerArm.r = Arms.LowerArm.r.multiply(rightHandOffscreen ? 0 : 1);

  Arms.Hand.l = Arms.Hand.l.multiply(leftHandOffscreen ? 0 : 1);
  Arms.Hand.r = Arms.Hand.r.multiply(rightHandOffscreen ? 0 : 1);

  //skip calculations if disable legs
  if (Legs) {
    Legs.UpperLeg.l = Legs.UpperLeg.l.multiply(rightFootOffscreen ? 0 : 1);
    Legs.UpperLeg.r = Legs.UpperLeg.r.multiply(leftFootOffscreen ? 0 : 1);
    Legs.LowerLeg.l = Legs.LowerLeg.l.multiply(rightFootOffscreen ? 0 : 1);
    Legs.LowerLeg.r = Legs.LowerLeg.r.multiply(leftFootOffscreen ? 0 : 1);
  }

  return {
    RightUpperArm: Arms.UpperArm.r,
    RightLowerArm: Arms.LowerArm.r,
    LeftUpperArm: Arms.UpperArm.l,
    LeftLowerArm: Arms.LowerArm.l,
    RightHand: Arms.Hand.r,
    LeftHand: Arms.Hand.l,
    RightUpperLeg: Legs ? Legs.UpperLeg.r : RestingDefault.Pose.RightUpperLeg,
    RightLowerLeg: Legs ? Legs.LowerLeg.r : RestingDefault.Pose.RightLowerLeg,
    LeftUpperLeg: Legs ? Legs.UpperLeg.l : RestingDefault.Pose.LeftUpperLeg,
    LeftLowerLeg: Legs ? Legs.LowerLeg.l : RestingDefault.Pose.LeftLowerLeg,
    Hips: Hips.Hips,
    Spine: Hips.Spine,
  };
}
