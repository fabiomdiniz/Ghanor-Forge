import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ChevronLeft, Save, X, Info, Shield, Sword, BookOpen, Sparkles } from 'lucide-react';
import { Character, AttributeSet, SkillName, Attribute } from '../types';
import { RACES, CLASSES, ORIGINS, SKILLS } from '../data/rules';
import { calculateTotalAttributePoints, getAttributeCost } from '../utils/characterUtils';

interface Props {
  onSave: (char: Character) => void;
  onCancel: () => void;
}

const STEPS = [
  'Conceito',
  'Atributos',
  'Raça',
  'Classe',
  'Origem',
  'Perícias',
  'Finalizar'
];

export default function CharacterWizard({ onSave, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [char, setChar] = useState<Partial<Character>>({
    name: '',
    concept: '',
    level: 1,
    attributes: { FOR: 0, DES: 0, CON: 0, INT: 0, SAB: 0, CAR: 0 },
    trainedSkills: [],
    equipment: [],
    notes: ''
  });

  const [humanBonus, setHumanBonus] = useState<Attribute[]>([]);
  const [halfElfBonus, setHalfElfBonus] = useState<Attribute | null>(null);

  const pointsUsed = useMemo(() => {
    return calculateTotalAttributePoints(char.attributes as AttributeSet);
  }, [char.attributes]);

  const currentRace = useMemo(() => RACES.find(r => r.name === char.race), [char.race]);
  const currentClass = useMemo(() => CLASSES.find(c => c.name === char.class), [char.class]);
  const currentOrigin = useMemo(() => ORIGINS.find(o => o.name === char.origin), [char.origin]);

  const finalAttributes = useMemo(() => {
    const base = { ...(char.attributes as AttributeSet) };
    if (currentRace) {
      (Object.entries(currentRace.modifiers) as [Attribute, number][]).forEach(([attr, mod]) => {
        base[attr] += mod;
      });
      if (char.race === 'Humano') {
        humanBonus.forEach(attr => base[attr] += 1);
      }
      if (char.race === 'Meio-elfo' && halfElfBonus) {
        base[halfElfBonus] += 1;
      }
    }
    return base;
  }, [char.attributes, currentRace, humanBonus, halfElfBonus]);

  const availableSkills = useMemo(() => {
    if (!currentClass) return [];
    const classSkills = currentClass.trainedSkills;
    const originSkills = currentOrigin?.trainedSkills || [];
    return Array.from(new Set([...classSkills, ...originSkills]));
  }, [currentClass, currentOrigin]);

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const updateAttr = (attr: Attribute, delta: number) => {
    const current = char.attributes![attr];
    const next = current + delta;
    
    setChar({
      ...char,
      attributes: { ...char.attributes!, [attr]: next }
    });
  };

  const toggleSkill = (skill: SkillName) => {
    const current = char.trainedSkills || [];
    if (current.includes(skill)) {
      setChar({ ...char, trainedSkills: current.filter(s => s !== skill) });
    } else {
      setChar({ ...char, trainedSkills: [...current, skill] });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="ghanor-title">Quem é seu herói?</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase mb-1">Nome do Personagem</label>
                <input 
                  type="text" 
                  className="ghanor-input text-xl" 
                  value={char.name}
                  onChange={e => setChar({ ...char, name: e.target.value })}
                  placeholder="Ex: Ruff Ghanor"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-1">Conceito</label>
                <input 
                  type="text" 
                  className="ghanor-input" 
                  value={char.concept}
                  onChange={e => setChar({ ...char, concept: e.target.value })}
                  placeholder="Ex: Um clérigo de São Arnaldo em busca de redenção"
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="ghanor-title">Atributos Básicos</h2>
              <div className="text-2xl font-bold text-ghanor-brown">
                Pontos Gastos: {pointsUsed}
              </div>
            </div>
            <p className="text-sm italic mb-4">Você começa com 0 em tudo. Distribua seus pontos como preferir.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'] as Attribute[]).map(attr => (
                <div key={attr} className="bg-parchment-dark p-4 rounded border border-ghanor-gold/30 flex flex-col items-center">
                  <span className="font-bold text-lg">{attr}</span>
                  <div className="flex items-center gap-4 mt-2">
                    <button onClick={() => updateAttr(attr, -1)} className="w-8 h-8 rounded-full bg-ghanor-red text-white font-bold">-</button>
                    <span className="text-2xl font-bold w-8 text-center">{char.attributes![attr]}</span>
                    <button onClick={() => updateAttr(attr, 1)} className="w-8 h-8 rounded-full bg-ghanor-red text-white font-bold">+</button>
                  </div>
                  <span className="text-xs mt-1 opacity-60">Custo: {getAttributeCost(char.attributes![attr])}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="ghanor-title">Escolha sua Raça</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RACES.map(r => (
                <button
                  key={r.name}
                  onClick={() => setChar({ ...char, race: r.name })}
                  className={`p-4 text-left rounded border-2 transition-all ${char.race === r.name ? 'border-ghanor-red bg-parchment-dark' : 'border-ghanor-gold/20 hover:border-ghanor-gold'}`}
                >
                  <div className="font-bold text-xl text-ghanor-red">{r.name}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {Object.entries(r.modifiers).map(([a, m]) => `${a} ${m > 0 ? '+' : ''}${m}`).join(', ')}
                  </div>
                  <ul className="mt-2 space-y-1">
                    {r.abilities.map(a => <li key={a} className="text-xs flex items-start gap-1"><Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" /> {a}</li>)}
                  </ul>
                </button>
              ))}
            </div>
            {char.race === 'Humano' && (
              <div className="mt-4 p-4 bg-ghanor-gold/10 rounded border border-ghanor-gold">
                <p className="font-bold mb-2">Bônus Humano: Escolha 3 atributos para ganhar +1</p>
                <div className="flex flex-wrap gap-2">
                  {(['FOR', 'DES', 'CON', 'INT', 'SAB', 'CAR'] as Attribute[]).map(attr => (
                    <button
                      key={attr}
                      onClick={() => {
                        if (humanBonus.includes(attr)) setHumanBonus(humanBonus.filter(a => a !== attr));
                        else if (humanBonus.length < 3) setHumanBonus([...humanBonus, attr]);
                      }}
                      className={`px-3 py-1 rounded border ${humanBonus.includes(attr) ? 'bg-ghanor-red text-white' : 'bg-white'}`}
                    >
                      {attr}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {char.race === 'Meio-elfo' && (
              <div className="mt-4 p-4 bg-ghanor-gold/10 rounded border border-ghanor-gold">
                <p className="font-bold mb-2">Bônus Meio-elfo: Escolha 1 atributo extra para ganhar +1</p>
                <div className="flex flex-wrap gap-2">
                  {(['FOR', 'DES', 'CON', 'INT', 'SAB'] as Attribute[]).map(attr => (
                    <button
                      key={attr}
                      onClick={() => setHalfElfBonus(attr)}
                      className={`px-3 py-1 rounded border ${halfElfBonus === attr ? 'bg-ghanor-red text-white' : 'bg-white'}`}
                    >
                      {attr}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="ghanor-title">Escolha sua Classe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {CLASSES.map(c => (
                <button
                  key={c.name}
                  onClick={() => setChar({ ...char, class: c.name, trainedSkills: [] })}
                  className={`p-4 text-left rounded border-2 transition-all ${char.class === c.name ? 'border-ghanor-red bg-parchment-dark' : 'border-ghanor-gold/20 hover:border-ghanor-gold'}`}
                >
                  <div className="font-bold text-xl text-ghanor-red">{c.name}</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                    <div><span className="opacity-60">PV:</span> {c.hpBase} + CON</div>
                    <div><span className="opacity-60">PM:</span> {c.mpBase}</div>
                    <div className="col-span-2"><span className="opacity-60">Perícias:</span> {c.trainedSkills.join(', ')} + {c.extraSkillsCount}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="ghanor-title">Escolha sua Origem</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {ORIGINS.map(o => (
                <button
                  key={o.name}
                  onClick={() => setChar({ ...char, origin: o.name })}
                  className={`p-4 text-left rounded border-2 transition-all ${char.origin === o.name ? 'border-ghanor-red bg-parchment-dark' : 'border-ghanor-gold/20 hover:border-ghanor-gold'}`}
                >
                  <div className="font-bold text-lg text-ghanor-red">{o.name}</div>
                  <div className="text-xs mt-1">
                    <span className="font-bold">Perícias:</span> {o.trainedSkills.length > 0 ? o.trainedSkills.join(', ') : 'Nenhuma'}
                  </div>
                  <div className="text-xs mt-1 italic">{o.benefit}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 5: {
        const intBonus = finalAttributes.INT > 0 ? finalAttributes.INT : 0;
        const maxSkills = (currentClass?.extraSkillsCount || 0) + intBonus + (char.race === 'Humano' ? 2 : 0);
        const selectedCount = char.trainedSkills?.length || 0;
        
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="ghanor-title">Perícias Treinadas</h2>
              <div className={`text-xl font-bold ${selectedCount > maxSkills ? 'text-red-600' : 'text-ghanor-brown'}`}>
                {selectedCount} / {maxSkills}
              </div>
            </div>
            <p className="text-sm italic">Você já é treinado nas perícias de sua Classe e Origem. Escolha as adicionais.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {(Object.keys(SKILLS) as SkillName[]).map(skill => {
                const isFixed = currentClass?.trainedSkills.includes(skill) || currentOrigin?.trainedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    disabled={isFixed}
                    onClick={() => toggleSkill(skill)}
                    className={`p-2 text-sm rounded border text-left transition-all ${
                      isFixed ? 'bg-ghanor-gold/20 border-ghanor-gold opacity-80' :
                      char.trainedSkills?.includes(skill) ? 'bg-ghanor-red text-white border-ghanor-red' :
                      'bg-white border-gray-200 hover:border-ghanor-gold'
                    }`}
                  >
                    {skill} {isFixed && <span className="text-[10px] block opacity-60">(Fixo)</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="ghanor-title">Revisão do Herói</h2>
            <div className="parchment-card bg-white/50 border-none shadow-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="border-b border-ghanor-gold pb-2">
                    <h3 className="text-4xl font-bold text-ghanor-red">{char.name || 'Herói Sem Nome'}</h3>
                    <p className="italic opacity-70">{char.concept || 'Sem conceito definido'}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {(Object.entries(finalAttributes) as [Attribute, number][]).map(([attr, val]) => (
                      <div key={attr} className="text-center">
                        <div className="text-xs font-bold opacity-60">{attr}</div>
                        <div className="text-2xl font-bold">{val > 0 ? `+${val}` : val}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> <span className="font-bold">Raça:</span> {char.race}</div>
                    <div className="flex items-center gap-2"><Sword className="w-4 h-4" /> <span className="font-bold">Classe:</span> {char.class}</div>
                    <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> <span className="font-bold">Origem:</span> {char.origin}</div>
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-100 p-3 rounded text-center">
                      <div className="text-xs uppercase font-bold text-red-800">Vida (PV)</div>
                      <div className="text-3xl font-bold text-red-900">{(currentClass?.hpBase || 0) + finalAttributes.CON}</div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded text-center">
                      <div className="text-xs uppercase font-bold text-blue-800">Mana (PM)</div>
                      <div className="text-3xl font-bold text-blue-900">{(currentClass?.mpBase || 0)}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-xs mb-2 opacity-60">Perícias Treinadas</h4>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(new Set([...(currentClass?.trainedSkills || []), ...(currentOrigin?.trainedSkills || []), ...(char.trainedSkills || [])])).map(s => (
                        <span key={s} className="px-2 py-0.5 bg-ghanor-brown/10 rounded text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-bold uppercase mb-1 opacity-60">Notas & História</label>
                    <textarea 
                      className="ghanor-input min-h-[100px] text-sm" 
                      value={char.notes}
                      onChange={e => setChar({ ...char, notes: e.target.value })}
                      placeholder="Escreva aqui a história do seu herói..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    if (step === 0) return char.name && char.concept;
    if (step === 1) return true;
    if (step === 2) {
      if (!char.race) return false;
      if (char.race === 'Humano' && humanBonus.length < 3) return false;
      if (char.race === 'Meio-elfo' && !halfElfBonus) return false;
      return true;
    }
    if (step === 3) return !!char.class;
    if (step === 4) return !!char.origin;
    if (step === 5) {
      const intBonus = finalAttributes.INT > 0 ? finalAttributes.INT : 0;
      const maxSkills = (currentClass?.extraSkillsCount || 0) + intBonus + (char.race === 'Humano' ? 2 : 0);
      return (char.trainedSkills?.length || 0) <= maxSkills;
    }
    return true;
  };

  const handleFinalSave = () => {
    const finalChar: Character = {
      ...char as Character,
      id: crypto.randomUUID(),
      attributes: finalAttributes,
      trainedSkills: Array.from(new Set([...(currentClass?.trainedSkills || []), ...(currentOrigin?.trainedSkills || []), ...(char.trainedSkills || [])])),
      currentHP: (currentClass?.hpBase || 0) + finalAttributes.CON,
      maxHP: (currentClass?.hpBase || 0) + finalAttributes.CON,
      currentMP: (currentClass?.mpBase || 0),
      maxMP: (currentClass?.mpBase || 0),
      equipment: [...(currentOrigin?.items || [])],
      level: 1
    };
    onSave(finalChar);
  };

  return (
    <div className="parchment-card w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b-2 border-ghanor-gold pb-4">
        <div className="flex gap-2">
          {STEPS.map((s, i) => (
            <div 
              key={s} 
              className={`w-3 h-3 rounded-full ${i === step ? 'bg-ghanor-red' : i < step ? 'bg-ghanor-gold' : 'bg-gray-300'}`}
              title={s}
            />
          ))}
        </div>
        <button onClick={onCancel} className="text-ghanor-brown hover:text-ghanor-red">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="min-h-[400px]">
        {renderStep()}
      </div>

      <div className="flex justify-between mt-12 pt-6 border-t-2 border-ghanor-gold">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className="ghanor-button bg-transparent text-ghanor-brown border-ghanor-brown hover:bg-ghanor-brown/10 flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> Anterior
        </button>
        
        {step === STEPS.length - 1 ? (
          <button
            onClick={handleFinalSave}
            className="ghanor-button bg-green-700 hover:bg-green-800 flex items-center gap-2"
          >
            <Save className="w-5 h-5" /> Gravar Ficha
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="ghanor-button flex items-center gap-2"
          >
            Próximo <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
