// Prints the header search's index as JSON for the preview (build-preview.mjs), built by the same
// function the site loads on the first open of its search.
import { buildSearchEntries } from "../../app/src/site/search/entries";

process.stdout.write(JSON.stringify(buildSearchEntries()));
