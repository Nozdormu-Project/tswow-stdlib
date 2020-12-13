import { DBC } from "wotlkdata";
import { Subsystem } from "wotlkdata/cell/Subsystem";
import { SkillLineAbilityRow } from "wotlkdata/dbc/types/SkillLineAbility";
import { Ids } from "../Base/Ids";
import { Spell } from "./Spell";

export class TrivialSkillLineRank extends Subsystem<SpellSkillLineAbility> {
    get High() { return this.ownerWrap(this.owner.row.TrivialSkillLineRankHigh); }
    get Low() { return this.ownerWrap(this.owner.row.TrivialSkillLineRankLow); }
    set(low: number, high: number) {
        this.Low.set(low);
        this.High.set(high);
        return this.owner;
    }
}

export class SpellSkillLineAbility extends Subsystem<Spell> {
    readonly row: SkillLineAbilityRow;

    constructor(owner: Spell, row: SkillLineAbilityRow) {
        super(owner);
        this.row = row;
    }

    get RaceMask() { return this.wrap(this.row.RaceMask); }
    get ClassMask() { return this.wrap(this.row.ClassMask); }
    get ClassMaskForbidden() { return this.wrap(this.row.ClassMaskForbidden); }
    get MinSkillRank() { return this.wrap(this.row.MinSkillLineRank); }

    /** The spell this spell is superceded by */
    get SupercededBy() { return this.wrap(this.row.SupercededBySpell); }
    get AcquireMethod() { return this.wrap(this.row.AcquireMethod); }
    get TrivialRank() { return new TrivialSkillLineRank(this); }
    get SkillLine() { return this.wrap(this.row.SkillLine); }
    get CharacterPoints() { return this.wrapArray(this.row.CharacterPoints); }
}

export class SpellSkillLineAbilites extends Subsystem<Spell> {
    protected values() {
        return DBC.SkillLineAbility.filter({Spell: this.owner.ID})
    }

    get length() { return this.values().length; }
    getIndex(index: number) { return this.values()[index]; }

    forEach(callback: (sla: SpellSkillLineAbility, index: number) => any) {
        const values = this.values();
        for(let i=0;i<values.length;++i) {
            callback(new SpellSkillLineAbility(this.owner,values[i]),i);
        }
    }

    add(skillLine: number, raceMask = 0, classMask = 0) {
        return new SpellSkillLineAbility(this.owner, DBC.SkillLineAbility.add(Ids.SkillLineAbility.id())
            .SkillLine.set(skillLine)
            .RaceMask.set(raceMask)
            .ClassMask.set(classMask)
            .Spell.set(this.owner.ID));
    }

    objectify() { 
        return this.values().map(x=>x.objectify());
    }
}