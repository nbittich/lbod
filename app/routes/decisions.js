import Route from '@ember/routing/route';
import Decision from '../models/decision';

export default class DecisionsRoute extends Route {
    async model(){
        const query = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
        PREFIX eli: <http://data.europa.eu/eli/ontology#> 
        PREFIX aard: <https://data.vlaanderen.be/id/concept/AardWetgeving/>
        select distinct ?title ?datePublication from <https://data.vlaanderen.be/ns/wetgeving> 
        WHERE { 
                ?decreet eli:type_document aard:Decreet;
                    eli:is_realized_by ?isRealizedBy.
                    ?isRealizedBy a eli:LegalExpression;
                eli:title ?title;
                eli:date_publication ?datePublication.
        }  order by desc(?datePublication) limit 5
        `;

        const endpoint = `https://codex.opendata.api.vlaanderen.be:8888/sparql?query=${encodeURIComponent(query)}`;
        const response = await fetch(endpoint, { headers: { 'Accept': 'application/sparql-results+json'} } );
        const decisions =  await response.json();
        console.log(decisions.results.bindings)
        return decisions.results.bindings.map(d=> new Decision(d.title.value, d.datePublication.value));
    }
}
