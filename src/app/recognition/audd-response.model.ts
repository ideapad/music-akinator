export class AuddSongReponse {
  status: string;
  result: {
    artist: string;
    title: string;
    album: string;
    deezer: {
      preview: string;
      artist: {
        picture_small: string;
      };
      album: {
        cover_big: string;
      }
    }
  };
}