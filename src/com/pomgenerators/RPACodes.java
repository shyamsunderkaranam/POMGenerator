import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class PrepareATGLinksService {

    public List<JsonObject> getALLATGEnvUrls(String tierNames) {
        // Step 1: Get config from envData (assumed to return JsonArray)
        JsonArray config = envData.getData(ATG_ENV_CONFIG_FILE); // envData assumed to return JsonArray

        // Step 2: Extract env and persona config
        JsonObject envJsonObject = config.get(0).getAsJsonObject();
        JsonObject personaJsonObject = config.get(1).getAsJsonObject(); // If unused, can remove

        // Step 3: Get tiers array
        JsonArray tiers = envJsonObject.getAsJsonArray("tiers");

        // Step 4: Filter tiers and call createEnvironmentDetailsfromTier
        List<List<JsonObject>> tempListObject = StreamSupport.stream(tiers.spliterator(), false)
            .map(JsonElement::getAsJsonObject)
            .filter(tierJson -> {
                String tier = tierJson.get("tier").getAsString();
                return tier.equalsIgnoreCase(tierNames) || tierNames.equalsIgnoreCase("ALL");
            })
            .map(this::createEnvironmentDetailsfromTier) // returns List<JsonObject>
            .filter(list -> list != null)
            .collect(Collectors.toList());

        // Step 5: Flatten the list
        List<JsonObject> tempJsonObjectList = tempListObject.stream()
            .flatMap(List::stream)
            .collect(Collectors.toList());

        return tempJsonObjectList;
    }

    // Stub method (assumed to exist)
    private List<JsonObject> createEnvironmentDetailsfromTier(JsonObject envTier) {
        // Replace with actual logic
        return new ArrayList<>();
    }
}

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonElement;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class PrepareATGLinksService {

    public List<JsonObject> createEnvironmentDetailsfromTier(JsonObject envTier) {
        String tierName = envTier.get("tier").getAsString();
        JsonArray atgenvs = envTier.getAsJsonArray("envs");

        // Stream over atgenvs
        List<List<JsonObject>> tempListObject = StreamSupport.stream(atgenvs.spliterator(), false)
            .map(JsonElement::getAsJsonObject)
            .filter(envt -> {
                JsonElement excludeElement = envt.get("excludeHealthCheck");
                // Treat missing or null values as "N"
                String value = excludeElement != null && !excludeElement.isJsonNull()
                        ? excludeElement.getAsString()
                        : "N";
                return !"Y".equalsIgnoreCase(value);
            })
            .map(atgenvt -> createPersonaDetailsFromEnv(atgenvt, tierName)) // returns List<JsonObject>
            .filter(list -> list != null)
            .collect(Collectors.toList());

        // Flatten the list of lists into a single list
        return tempListObject.stream()
            .flatMap(List::stream)
            .collect(Collectors.toList());
    }

    // Stub: implement as per your business logic
    private List<JsonObject> createPersonaDetailsFromEnv(JsonObject atgenvt, String tierName) {
        // Return a List<JsonObject> based on atgenvt and tierName
        return new ArrayList<>(); // placeholder
    }
}

public List<JsonObject> createPersonaDetailsFromEnv(JsonObject atgenvt, String tier) {
    JsonArray personas = personaJsonObject.getAsJsonArray("personas");
    logger.info("In createPersonaDetailsFromEnv");

    List<JsonObject> envLinks = new ArrayList<>();

    for (JsonElement personaElement : personas) {
        JsonObject persona = personaElement.getAsJsonObject();
        String siloNumber;
        int linkAvailability = 0;

        if ("app".equals(persona.get("persId").getAsString())) {
            int maxSilos = atgenvt.get("agentsilos").getAsInt();

            for (int l = 0; l < MAX_AGENT_SILOS; l++) {
                JsonObject envStateJSON = new JsonObject();
                envStateJSON.addProperty("tier", tier);
                envStateJSON.addProperty("environment", atgenvt.get("environments").getAsString());
                envStateJSON.addProperty("State", linkAvailability);
                envStateJSON.addProperty("applicable", "Y");
                envStateJSON.addProperty("ignoreEmailDummyEnable", atgenvt.get("ignoreEmailDummyEnable").getAsString());

                try {
                    siloNumber = String.format("%02d", l + 1);
                    String desiredLink = getDesiredLink(atgenvt, persona, siloNumber);

                    if ((l + 1) > maxSilos) {
                        envStateJSON.addProperty("applicable", "N");
                    }

                    envStateJSON.addProperty("persona", persona.get("persona").getAsString() + siloNumber);
                    envStateJSON.addProperty("Link", desiredLink);

                    envLinks.add(envStateJSON);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } else {
            boolean isTradepoint = "Tradepoint".equalsIgnoreCase(persona.get("persId").getAsString());
            boolean tradepointNA = "NA".equals(atgenvt.get("tradepoint").getAsString());

            if (!(tradepointNA && isTradepoint)) {
                JsonObject envStateJSON = new JsonObject();
                envStateJSON.addProperty("tier", tier);
                envStateJSON.addProperty("environment", atgenvt.get("environments").getAsString());
                envStateJSON.addProperty("State", linkAvailability);
                envStateJSON.addProperty("applicable", "Y");
                envStateJSON.addProperty("ignoreEmailDummyEnable", atgenvt.get("ignoreEmailDummyEnable").getAsString());

                try {
                    String desiredLink = getDesiredLink(atgenvt, persona, "");
                    envStateJSON.addProperty("Link", desiredLink);
                    envStateJSON.addProperty("persona", persona.get("persona").getAsString());

                    envLinks.add(envStateJSON);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    return envLinks;
}