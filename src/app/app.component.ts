import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule, DatePipe } from '@angular/common';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { ApiResponse, Race } from './type';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatButtonToggleModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private _httpClient = inject(HttpClient);
  private readonly apiUrl: string = environment.apiUrl;
  private readonly apiHeader: string = environment.apiHeader;
  private readonly apiKey: string = environment.apiKey;

  seasons: Array<string> = ['2022', '2023', '2024', '2025'];
  selectedSeason: string = this.seasons[0];

  displayedColumns: string[] = [
    'competitionName',
    'circuit',
    'location',
    'season',
    'fastest_lap',
    'distance',
    'date',
  ];
  dataSource = new MatTableDataSource<Race>([]);

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    // Cette fonction est appelée automatiquement par Angular chaque fois
    // que le <mat-paginator> est créé ou modifié dans le HTML via le *ngIf
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  ngOnInit() {
    // Initial fetch for the default season
    this.loadRaces(this.selectedSeason);
  }

  fetchRacesByCompetitionBySeason(
    season: string,
    type: string = 'race',
    competition?: string
  ): Observable<Race[]> {
    const params = new HttpParams().set('season', season).set('type', type);

    return this._httpClient
      .get<ApiResponse>(`${this.apiUrl}/races`, {
        headers: {
          [this.apiHeader]: this.apiKey,
        },
        params: params,
      })
      .pipe(
        map((response) => response.response as Race[]),
        catchError((errors) => {
          console.error('Error fetching races:', errors);
          // Retourne un tableau vide en cas d'erreur pour ne pas casser l'app
          return of([]);
        })
      );
  }

  onChangeSeason(season: string) {
    this.selectedSeason = season;
    this.loadRaces(season);
  }

  // Méthode helper pour éviter la duplication de code
  private loadRaces(season: string) {
    this.fetchRacesByCompetitionBySeason(season).subscribe((races) => {
      // 3. CRUCIAL : Mettre à jour la propriété .data du dataSource
      this.dataSource.data = races;

      // Optionnel : Revenir à la page 1 si on change de saison
      if (this.matPaginator) {
        this.matPaginator.firstPage();
      }
    });
  }
}
