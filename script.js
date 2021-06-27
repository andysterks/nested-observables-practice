window.onload = () => {
  console.log(window);
  
  getCharacters().subscribe(characters => console.log('characters: ', characters));
}

// this will return an observable of characters
function getCharacters() {
  var charactersObservable = fakeHttpModule.get('https://swapi.dev/api/people');  

  return rxjs.Observable.create(o => {
    charactersObservable.subscribe(charactersResponse => {
      const characters = charactersResponse.data.results;
  
      for (let i = 0; i < characters.length; i++) {
        const character = characters[i];
        console.log(character)
        
        var homeworldObservable = fakeHttpModule.get(character.homeworld);
        
        homeworldObservable.subscribe(homeworldResponse => {
          character.homeworldName = homeworldResponse.data.name;
        });
      }

      o.next(characters)
    });
  });
}

const fakeHttpModule = {
  get: function(url) {
    return rxjs.Observable.create(o => {
      axios.get(url).then(r => {
        o.next(r);
      });
    });
  }
}