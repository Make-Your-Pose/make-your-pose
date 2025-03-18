import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import type { Landmark, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { VRMLoaderPlugin } from '@pixiv/three-vrm';
import { solve } from 'src/solver/pose';

interface Props {
  poseData: NormalizedLandmark[];
  worldData: Landmark[];
}

function Avatar({ poseData, worldData }: Props) {
  const { scene } = useGLTF(
    '/export_f65506cf-69f2-40ee-8515-cd8929b3034c.vrm',
    undefined,
    undefined,
    (loader) => {
      // @ts-ignore
      loader.register((parser) => {
        // @ts-ignore
        return new VRMLoaderPlugin(parser);
      });
    },
  );
  const bones = useRef<{ [key: string]: THREE.Object3D | undefined }>({});

  useEffect(() => {
    if (!scene) return;

    // console.log(scene);

    // 본(Bone) 찾기
    const findBone = (name: string) => scene.getObjectByName(name);
    bones.current = {
      Hips: findBone('Hips'),
      Spine: findBone('Spine'),
      LeftShoulder: findBone('LeftShoulder'),
      RightShoulder: findBone('RightShoulder'),
      LeftArm: findBone('LeftArm'),
      RightArm: findBone('RightArm'),
      LeftForeArm: findBone('LeftForeArm'),
      RightForeArm: findBone('RightForeArm'),
      LeftHand: findBone('LeftHand'),
      RightHand: findBone('RightHand'),
      LeftUpLeg: findBone('LeftUpLeg'),
      RightUpLeg: findBone('RightUpLeg'),
      LeftLeg: findBone('LeftLeg'),
      RightLeg: findBone('RightLeg'),
      LeftFoot: findBone('LeftFoot'),
      RightFoot: findBone('RightFoot'),
      LeftToeBase: findBone('LeftToeBase'),
      RightToeBase: findBone('RightToeBase'),
    };
  }, [scene]);

  useEffect(() => {
    if (!poseData || !bones.current.Hips) return;

    const solution = solve(worldData, poseData);

    const rigRotation = (
      name: string,
      rotation = { x: 0, y: 0, z: 0 },
      dampener = 1,
      lerpAmount = 0.1,
    ) => {
      const part = bones.current[name];
      if (!part) {
        return;
      }

      const euler = new THREE.Euler(
        rotation.x * dampener,
        rotation.y * dampener,
        rotation.z * dampener,
      );
      const quaternion = new THREE.Quaternion().setFromEuler(euler);
      part.quaternion.slerp(quaternion, lerpAmount);
    };

    const rigPosition = (
      name: string,
      position = { x: 0, y: 0, z: 0 },
      dampener = 1,
      lerpAmount = 0.05,
    ) => {
      const part = bones.current[name];
      if (!part) {
        return;
      }

      const vector = new THREE.Vector3(
        position.x * dampener,
        position.y * dampener,
        position.z * dampener,
      );
      part.position.lerp(vector, lerpAmount);
    };

    // UpperArm -> Arm? Shoulder?
    // LowerArm -> ForeArm?
    // UpperLeg -> UpLeg
    // LowerLeg -> Leg

    rigRotation('Hips', solution.Hips.rotation, 1);
    rigPosition(
      'Hips',
      {
        x: -solution.Hips.position.x, // Reverse direction
        y: solution.Hips.position.y + 1, // Add a bit of height
        z: -solution.Hips.position.z, // Reverse direction
      },
      1,
      0.07,
    );

    rigRotation('Chest', solution.Spine, 0.25);
    rigRotation('Spine', solution.Spine, 0.45);

    rigRotation('RightArm', solution.RightUpperArm, 1);
    rigRotation('RightForeArm', solution.RightLowerArm, 1);
    rigRotation('LeftArm', solution.LeftUpperArm, 1);
    rigRotation('LeftForeArm', solution.LeftLowerArm, 1);

    rigRotation('LeftUpLeg', solution.LeftUpperLeg, 1, 0.1);
    rigRotation('LeftLeg', solution.LeftLowerLeg, 1, 0.1);
    rigRotation('RightUpLeg', solution.RightUpperLeg, 1, 0.1);
    rigRotation('RightLeg', solution.RightLowerLeg, 1, 0.1);
  }, [poseData, worldData]);

  return <primitive object={scene} scale={1.5} />;
}

export default Avatar;
