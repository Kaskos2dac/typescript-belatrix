import { Component, OnInit } from '@angular/core';
import { TeamService, TeamsTableHeaders } from '../services/team.service';
import { Observable } from 'rxjs';
import { Team } from '../interfaces/team';
import { take } from 'rxjs/operators';
import { Countries } from '../interfaces/player';

@Component({
  selector: 'app-team-table',
  templateUrl: './team-table.component.html',
  styleUrls: ['./team-table.component.scss']
})
export class TeamTableComponent implements OnInit {
  // el $ nos indica que es una variable asincronica
  public team$: Observable<Team[]>;
  public tableHeaders =  TeamsTableHeaders;
  constructor(private teamService: TeamService) {}

  ngOnInit() {
    this.team$ = this.teamService.getTeams();
    this.teamService
      .getTeams()
      .pipe(take(1))
      .subscribe(teams => {
        if (teams.length === 0) {
          const team: Team = {
            name: 'MyAmazingTeam',
            country: Countries.Colombia,
            players: null
          };
          this.teamService.addTeam(team);
        }
      });
  }
}
