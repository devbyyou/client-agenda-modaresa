export interface Seances {
  id:number
  categorie_id: number
  date:string
  equipe_id: number
  heure:string
  horaire:string
  lieu:string
  presences: Presences[]
}
export interface Presences {
  statut: string,
  id: number,
  joueur_id: number,
  seance_id: number,
  absence: string,
  retard: string,
  created_at: string,
  updated_at:string,
  JoueurId: number

}
