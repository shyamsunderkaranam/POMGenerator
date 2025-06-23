import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class PrepareATGLinksService {

    public List<JsonObject> getALLATGEnvUrls(String tierNames) {

        JsonArray config = envData.getData(ATG_ENV_CONFIG_FILE); // Assuming envData returns JsonArray
        JsonObject envJsonObject = config.get(0).getAsJsonObject();
        JsonObject personaJsonObject = config.get(1).getAsJsonObject();
        JsonArray tiers = envJsonObject.getAsJsonArray("tiers");

        // Stream the tiers array
        Stream<JsonObject> tierStream = StreamSupport.stream(tiers.spliterator(), false)
            .map(JsonElement::getAsJsonObject)
            .filter(obj -> {
                String tier = obj.get("tier").getAsString();
                return tier.equalsIgnoreCase(tierNames) || tierNames.equalsIgnoreCase("ALL");
            });

        // Apply downstream processing for each tier
        List<List<JsonObject>> tempListObject = tierStream
            .map(envTier -> createEnvironmentDetailsfromTier(envTier)) // Assuming this returns List<JsonObject>
            .collect(Collectors.toList());

        // Flatten the result
        List<JsonObject> finalList = tempListObject.stream()
            .flatMap(List::stream)
            .collect(Collectors.toList());

        return finalList;
    }

    private List<JsonObject> createEnvironmentDetailsfromTier(JsonObject envTier) {
        // Your implementation here
        return new ArrayList<>(); // placeholder
    }
}