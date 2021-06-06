const { Message, Client, MessageEmbed } = require('discord.js');
const dndapi = require('./dndapi');

const inviteLink = 'https://discord.com/api/oauth2/authorize?client_id=850804736465567814&permissions=519232&scope=bot';

/**
 * 
 * @param {string} cmd 
 * @param {string[]} args 
 * @param {Message} msg 
 * @param {Client} bot 
 */
const command = async (cmd, args, msg, bot) => {
    const e = new MessageEmbed()
    .setColor('RANDOM')
    .setAuthor(msg.author.username, msg.author.avatarURL());            

    switch(cmd) {

        case 'abilityscores':
        case 'abilityscore':
        case 'abscore':
            if(checkArgs(args)) return;
            const ab = await dndapi(`ability-scores/${args[1].toLowerCase()}`);
            if(errorCheck(ab, msg, 'Note: Ability scores are indexed with their abbrieviated form, so `strength` would be `str`!')) return;

            e.setTitle(ab.full_name)
            .setColor('#ff0000')
            .setDescription(`*${ab.index}*\n${ab.desc.join('\n')}`)
            .addField('Skills', apiref(ab.skills));

            msg.channel.send(e);
        break;

        case 'skills':
        case 'skill':
            if(checkArgs(args)) return;
            const skill = await dndapi(`skills/${args[1].toLowerCase()}`)
            if(errorCheck(skill, msg)) return;

            e.setTitle(skill.name)
            .setColor('#b300ff')
            .setDescription(`*${skill.index}*\n${skill.desc[0]}`)
            .addField('Ability Score', `${skill.ability_score.name}`);

            msg.channel.send(e);

        break;

        case 'proficiencies':
        case 'proficiency':
        case 'prof':
            if(checkArgs(args)) return;
            const prof = await dndapi(`proficiencies/${args[1].toLowerCase()}`);
            if(errorCheck(prof, msg)) return;

            e.setTitle(prof.name)
            .setColor('#24ff57')
            .setDescription(`*${prof.index}*`)
            .addField('Classes', apiref(prof.classes), true)
            .addField('Races', apiref(prof.races), true)
            .addField('References', prof.references[0] ? prof.references.map(v => `\`${v.name}\` -- \`${v.type}\``) : 'None', true);

            msg.channel.send(e);

        break;

        case 'languages':
        case 'language':
        case 'lang':
            if(checkArgs(args)) return;
            const lang = await dndapi(`languages/${args[1].toLowerCase()}`);
            if(errorCheck(lang, msg)) return;

            e.setTitle(lang.name)
            .setColor('#03ffee')
            .setDescription(`*${lang.index}*`)
            .addField('Type', lang.type, true)
            .addField('Typical Speakers', lang.typical_speakers.join('\n'), true)
            .addField('Script', lang.script, true);

            msg.channel.send(e);
        break;

        case 'alignments':
        case 'alignment':
        case 'align':
            if(checkArgs(args)) return;
            const align = await dndapi(`alignments/${args[1].toLowerCase()}`);
            if(errorCheck(align, msg, 'Make sure to put a dash between the two, like `Lawful Good` would be `lawful-good`.')) return;

            e.setTitle(align.name)
            .setDescription(`*${align.index}*\n${align.desc}`);

            msg.channel.send(e);
        break;

        case 'backgrounds':
        case 'background':
            if(checkArgs(args)) return;
            const back = await dndapi(`backgrounds/${args[1].toLowerCase()}`);
            if(errorCheck(back, msg)) return;

            e.setTitle(back.name)
            .setDescription(`*${back.index}*\n**${back.feature.name}**\n${back.feature.desc[0]}`);

            msg.channel.send(e);
        break;

        case 'classes':
        case 'class':
            if(checkArgs(args)) return;
            const clas = await dndapi(`classes/${args[1].toLowerCase()}`);
            if(errorCheck(clas, msg)) return;

            e.setTitle(clas.name)
            .setDescription(`*${clas.index}*`)
            .addField('Hit Die', clas.hit_die, true)
            .addField('Saving Throws', clas.saving_throws.map(v => v.name).join('\n'), true)
            .addField('Subclasses', apiref(clas.subclasses), true);

            msg.channel.send(e);
        break;

        case 'subclasses':
        case 'subclass':
            if(checkArgs(args)) return;
            const sub = await dndapi(`subclasses/${args[1].toLowerCase()}`);
            if(errorCheck(sub, msg)) return;

            e.setTitle(sub.name)
            .setDescription(`*${sub.index}*\n**${sub.subclass_flavor}**\n${sub.desc[0]}`)
            .addField('Class', sub.class.name, true);

            msg.channel.send(e);
        break;

        case 'features':
        case 'feature':
            if(checkArgs(args)) return;
            const feat = await dndapi(`features/${args[1].toLowerCase()}`);
            if(errorCheck(feat, msg, 'Example: `Action Surge (1 use)` would be `action-surge-1-use`')) return;

            e.setTitle(feat.name)
            .setDescription(`*${feat.index}*\n${feat.desc[0]}`)
            .addField('Class', feat.class.name, true)
            .addField('Level', feat.level, true);

            msg.channel.send(e);
        break;

        case 'races':
        case 'race':
            if(checkArgs(args)) return;
            const race = await dndapi(`races/${args[1].toLowerCase()}`);
            if(errorCheck(race, msg)) return;

            e.setTitle(race.name)
            .setDescription(`*${race.index}*\n**Alignment**\n${race.alignment}\n\n` +
                `**Age**\n${race.age}\n\n` +
                `**Size**\n${race.size_description}\n\n` +
                `**Language**\n${race.language_desc}\n\n`
            )
            .addField('Ability Bonus', `${race.ability_bonuses.map(v => `${v.ability_score.name}: ${v.bonus}`).join('\n')}`, true)
            .addField('Traits', apiref(race.traits), true)
            .addField('Subraces', apiref(race.subraces), true);

            msg.channel.send(e);
        break;

        case 'subraces':
        case 'subrace':
            if(checkArgs(args)) return;
            const subrace = await dndapi(`subraces/${args[1].toLowerCase()}`);
            if(errorCheck(subrace, msg)) return;

            e.setTitle(subrace.name)
            .setDescription(`*${subrace.index}*\n${subrace.desc}`)
            .addField('Ability Bonus', `${subrace.ability_bonuses.map(v => `${v.ability_score.name}: ${v.bonus}`)}`, true)
            .addField('Traits', apiref(subrace.racial_traits), true)
            .addField('Race', subrace.race.name, true);

            msg.channel.send(e);
        break;

        case 'traits':
        case 'trait':
            if(checkArgs(args)) return;
            const trait = await dndapi(`traits/${args[1].toLowerCase()}`);
            if(errorCheck(trait, msg)) return;

            e.setTitle(trait.name)
            .setDescription(`*${trait.index}*\n${trait.desc[0]}`)
            .addField('Races', apiref(trait.races), true)
            .addField('Subraces', apiref(trait.subraces), true)
            .addField('Proficiencies', apiref(trait.proficiencies), true);

            msg.channel.send(e);
        break;

        case 'equipmentscategories':
        case 'equipmentcategory':
        case 'equipcat':
            if(checkArgs(args)) return;
            const equipcat = await dndapi(`equipment-categories/${args[1].toLowerCase()}`);
            if(errorCheck(equipcat, msg)) return;

            e.setTitle(equipcat.name)
            .setDescription(`*${equipcat.index}*`)
            .addField('Equipment', apiref(equipcat.equipment));

            msg.channel.send(e);   
        break;

        case 'test':
            if(checkArgs(args)) return;
            const test = await dndapi(`test/${args[1].toLowerCase()}`);
            if(errorCheck(test, msg)) return;

            e.setTitle(test.name);

            msg.channel.send(e);
        break;

        case 'invite':
            e.setDescription(`[Invite me to your server](${inviteLink})`);

            msg.channel.send(e);
        break;

        case 'help':
            msg.channel.send('If you want to enter something that is two words like `Animal Handling`, you would need to enter `animal-handling`!\nUse Example: `dnd!abilityscore str`\nList of commands so far:\n`abilityscores` `skills` `proficiencies` `languages` `alignments` `backgrounds` `classes` `subclasses` `features` `races` `subraces` `traits` `equipmentcategory`');
        break;

        default:
            msg.channel.send('Invalid command');
        break;
    }
};

/**
 * 
 * @param {object} res 
 * @param {string} msg 
 * @param {Message} message 
 * @returns 
 */
const errorCheck = (res, message=null, msg=null) => {
    if(res.error) {
        if(message) message.channel.send(msg || 'Please check your spelling and accidental spaces.')
        return true;
    }
    return false;
}

const apiref = (ref) => {
    if(!ref[0]) return 'None'
    return ref.map(v => `\`${v.name}\``).join('\n')
}

const checkArgs = (args) => {
    if(!args[1]) return true;
    return false;
}

module.exports = command;