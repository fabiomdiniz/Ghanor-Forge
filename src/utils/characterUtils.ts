import { AttributeSet, Character, SkillName } from '../types';
import { SKILLS } from '../data/rules';

export const getAttributeModifier = (value: number): number => {
  return value; // In Ghanor, the attribute value IS the modifier (0 is human average)
};

export const calculateSkillBonus = (character: Character, skillName: SkillName): number => {
  const halfLevel = Math.floor(character.level / 2);
  const attribute = SKILLS[skillName];
  const attributeValue = character.attributes[attribute];
  const isTrained = character.trainedSkills.includes(skillName);
  
  let trainingBonus = 0;
  if (isTrained) {
    if (character.level >= 15) trainingBonus = 6;
    else if (character.level >= 7) trainingBonus = 4;
    else trainingBonus = 2;
  }

  return halfLevel + attributeValue + trainingBonus;
};

export const getAttributeCost = (value: number): number => {
  if (value < -1) return value; // Just return the value for very low attributes
  if (value === -1) return -1;
  if (value === 0) return 0;
  if (value === 1) return 1;
  if (value === 2) return 2;
  if (value === 3) return 4;
  if (value === 4) return 7;
  if (value > 4) return 7 + (value - 4) * 4; // Arbitrary scaling for values > 4
  return 0;
};

export const calculateTotalAttributePoints = (attributes: AttributeSet): number => {
  return Object.values(attributes).reduce((acc, val) => acc + getAttributeCost(val), 0);
};
