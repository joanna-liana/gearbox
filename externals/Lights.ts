export class Lights {
  position: number;

  /**
   * null - brak opcji w samochodzie
   * 1-3 - w dół
   * 7-10 - w górę
   * @return
   */
  public getLightsPosition(): number {
    return this.position;
  }
}
