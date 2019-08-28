import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Countries, squadNumber, Player } from '../interfaces/player';
import { PlayerService } from '../services/player.service';
import { TeamService } from '../services/team.service';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.scss']
})
export class PlayerDialogComponent implements OnInit {
  @Input() player: Player;
  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter(); /*estamos creando un evento */
  private team;
  public countries = Object.keys(Countries).map(key => ({ label: key, key: Countries[key] }));
  public squadNumber = Object.keys(squadNumber)
    .slice(Object.keys(squadNumber).length / 2) /*el metodo slice nos divide el squadNumber */
    .map(key => ({
      label: key,
      key: squadNumber[key]
    }));
  constructor(private playerService: PlayerService, private teamService: TeamService) {}

  ngOnInit() {
    this.teamService /*vamos a obtener los teams*/
      .getTeams()
      .pipe(take(1))
      .subscribe(teams => {
        if (teams.length > 0) {
          this.team = teams[0];
        }
      });
  }
  private newPlayer(playerFormValue) {
    const key = this.playerService.addPlayer(playerFormValue).key; // firebase nos permite tener una key creando el mismo
    const playerFormValueKey = {
      /*creamos un objeto que su propiedad extiende de una propiedad del padre */
      ...playerFormValue,
      key
    };
    const formattedTeam = {
      ...this.team,
      players: [...(this.team.players ? this.team.players : []), playerFormValueKey]
    };
    this.teamService.editTeam(formattedTeam);
  }

  private editPlayer(playerFormValue) {
    const playerFormValueWithKey = { ...playerFormValue, $key: this.player.$key };
    /*estamos asignando una nueva variable con todos los datos anteriores y su respectiva key*/
    const playerFormValueWithFormattedKey = { ...playerFormValue, key: this.player.$key };
    delete playerFormValueWithFormattedKey.$key;
    const moddifiedPlayers = this.team.players
      ? this.team.players.map(player => {
          return player.key === this.player.$key ? playerFormValueWithFormattedKey : player;
        })
      : this.team.players;
    const formattedTeam = {
      ...this.team,
      // tslint:disable-next-line:whitespace
      players: [...(moddifiedPlayers ? moddifiedPlayers : [playerFormValueWithFormattedKey])]
    };
    this.playerService.editPlayer(playerFormValueWithKey);
  }

  onSubmit(playerForm: NgForm) {
    const playerFormValue = { ...playerForm.value }; /*necesitamos saber el valor (...) esto es inmutabilidad*/
    if (playerForm.valid) {
      /*al colocar el .valid automaticamente va a comprar que el form sea valido*/
      playerFormValue.leftfooted = playerFormValue.leftfooted === '' ? false : playerFormValue.leftfooted;
      /* esto es para comprobar que el valor por defecto no sea vacio */
    }
    if (this.player) {
      this.editPlayer(playerFormValue);
    } else {
      this.newPlayer(playerFormValue);
    }

    window.location.replace('#');
  }

  onClose() {
    this.closeDialog.emit(true);
  }
}
