export type Attribute = 'FOR' | 'DES' | 'CON' | 'INT' | 'SAB' | 'CAR';

export interface AttributeSet {
  FOR: number;
  DES: number;
  CON: number;
  INT: number;
  SAB: number;
  CAR: number;
}

export type SkillName = 
  | 'Acrobacia' | 'Adestramento' | 'Atletismo' | 'Atuação' | 'Cavalgar' 
  | 'Conhecimento' | 'Cura' | 'Diplomacia' | 'Enganação' | 'Fortitude' 
  | 'Furtividade' | 'Guerra' | 'Iniciativa' | 'Intimidação' | 'Intuição' 
  | 'Investigação' | 'Ladinagem' | 'Luta' | 'Misticismo' | 'Nobreza' 
  | 'Ofício' | 'Percepção' | 'Pontaria' | 'Reflexos' | 'Religião' 
  | 'Sobrevivência' | 'Vontade';

export interface Race {
  name: string;
  modifiers: Partial<AttributeSet>;
  abilities: string[];
  size: 'Minúsculo' | 'Pequeno' | 'Médio' | 'Grande' | 'Enorme' | 'Colossal';
  speed: number;
}

export interface Class {
  name: string;
  hpBase: number;
  hpPerLevel: number;
  mpBase: number;
  mpPerLevel: number;
  trainedSkills: SkillName[];
  extraSkillsCount: number;
  proficiencies: string[];
  abilities: string[];
  keyAttribute: Attribute;
}

export interface Origin {
  name: string;
  trainedSkills: SkillName[];
  benefit: string;
  items: string[];
}

export interface Character {
  id: string;
  name: string;
  concept: string;
  level: number;
  race: string;
  class: string;
  origin: string;
  attributes: AttributeSet;
  trainedSkills: SkillName[];
  currentHP: number;
  maxHP: number;
  currentMP: number;
  maxMP: number;
  equipment: string[];
  notes: string;
}
