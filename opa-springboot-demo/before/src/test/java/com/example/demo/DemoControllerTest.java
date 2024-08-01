package com.example.demo;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class DemoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private static String toJSON(Object val) throws Exception{
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writer().withDefaultPrettyPrinter().writeValueAsString(val);
    }

    @Test
    public void testPutGetList () throws Exception {
        Map<String, Object> testObj1 = new HashMap<String, Object>();
        testObj1.put("hello", "world");

        // Create the object.
        this.mockMvc.perform(put("/object/test1")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJSON(testObj1))
            .accept(MediaType.APPLICATION_JSON)
            .header("Demo-User", "alice")
            .header("Demo-Tenant", "unittest"))
            .andExpect(status().isOk());

        // Read the object back.
        this.mockMvc.perform(get("/object/test1")
            .accept(MediaType.APPLICATION_JSON)
            .header("Demo-User", "alice")
            .header("Demo-Tenant", "unittest"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.hello").value("world"));

        // We shouldn't be able to see the key from a different tenant.
        this.mockMvc.perform(get("/object/test1")
            .accept(MediaType.APPLICATION_JSON)
            .header("Demo-User", "alice")
            .header("Demo-Tenant", "othertenant"))
            .andExpect(status().isNotFound());

        // List the objects and ensure the one we created is present.
        this.mockMvc.perform(get("/object")
            .accept(MediaType.APPLICATION_JSON)
            .header("Demo-User", "alice")
            .header("Demo-Tenant", "unittest"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[0]").value("test1"));
    }

    @Test
    public void testPutGetListDelete () throws Exception {
        Map<String, Object> testObj1 = new HashMap<String, Object>();
        testObj1.put("hello", "world");

        // Create the object.
        this.mockMvc.perform(put("/object/test1")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJSON(testObj1))
            .accept(MediaType.APPLICATION_JSON)
            .header("Demo-User", "alice")
            .header("Demo-Tenant", "unittest"))
            .andExpect(status().isOk());

        // Read the object back.
        this.mockMvc.perform(get("/object/test1")
            .accept(MediaType.APPLICATION_JSON)
            .header("Demo-User", "alice")
            .header("Demo-Tenant", "unittest"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.hello").value("world"));

        // List the objects and ensure the one we created is present.
        this.mockMvc.perform(get("/object")
            .accept(MediaType.APPLICATION_JSON)
            .header("Demo-User", "alice")
            .header("Demo-Tenant", "unittest"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[0]").value("test1"));

        // Delete the object.
        this.mockMvc.perform(delete("/object/test1")
            .header("Demo-User", "alice")
            .header("Demo-Tenant", "unittest"))
            .andExpect(status().isOk());

        // List the objects and ensure the one we deleted is no longer present.
        this.mockMvc.perform(get("/object")
            .accept(MediaType.APPLICATION_JSON)
            .header("Demo-User", "alice")
            .header("Demo-Tenant", "unittest"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.[0]").doesNotHaveJsonPath());

        // Ensure we can't read the object back anymore.
        this.mockMvc.perform(get("/object/test1")
            .accept(MediaType.APPLICATION_JSON)
            .header("Demo-User", "alice")
            .header("Demo-Tenant", "unittest"))
            .andExpect(status().isNotFound());
    }

}
