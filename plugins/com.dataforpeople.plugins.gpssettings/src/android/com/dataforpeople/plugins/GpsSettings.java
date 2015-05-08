package com.dataforpeople.plugins;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.content.Context;
import android.provider.Settings;
import android.app.Activity;

public class GpsSettings extends CordovaPlugin {

	@Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if(action.equals("launch")) {
        	launchGpsSettings();
            return true;
        }
        return false;
    }

    public void launchGpsSettings() {
    	Intent i = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    	this.cordova.getActivity().getApplicationContext().startActivity(i);
    }
}