import { Player, Countries } from './player';

export interface Team {
    $key?: string;
    name: string;
    country: Countries; /*estamos importando los paisese de la interface player*/
    players: Player[]; /*estamos importando los jugadores de la interface player*/
}
