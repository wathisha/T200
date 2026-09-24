/**
 * Science with Sheshadi LMS & ERP - Google Apps Script Global Cloud Backend
 * Deploy this script as a Web App (Execute as: 'Me', Who has access: 'Anyone')
 * to enable real-time global synchronization across all phones, tablets, and PCs.
 */

function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : "get_all";
  var docProperties = PropertiesService.getScriptProperties();
  
  if (action === "get_admin_auth") {
    var auth = docProperties.getProperty("lms_admin_auth");
    var res = auth ? JSON.parse(auth) : { username: "sheshadi", password: "password123" };
    return ContentService.createTextOutput(JSON.stringify({ status: "success", data: res }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Return entire global configuration
  var globalData = docProperties.getProperty("lms_global_data");
  var responseData = globalData ? JSON.parse(globalData) : {
    adminAuth: { username: "sheshadi", password: "password123" },
    settings: {
      academyName: "Sathsarani Science Academy",
      motto: "UNDERSTAND TODAY, SUCCEED TOMORROW",
      teacherName: "Mrs. Sheshadi Amarasinghe",
      teacherTitle: "B.Sc. (Chemistry Special), Grad.Chem (IChem) | Head Science Specialist",
      hotlines: "071 781 2092 | 077 161 4260",
      bgImage: "assets/images/lms_background.png"
    }
  };
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success", data: responseData }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var output = { status: "error", message: "Invalid payload" };
  try {
    var raw = e.postData.contents;
    var payload = JSON.parse(raw);
    var docProperties = PropertiesService.getScriptProperties();
    
    if (payload.action === "update_admin_auth") {
      var authObj = { username: payload.username.toLowerCase(), password: payload.password };
      docProperties.setProperty("lms_admin_auth", JSON.stringify(authObj));
      
      // Also update in global data bundle
      var curGlobal = docProperties.getProperty("lms_global_data");
      var gObj = curGlobal ? JSON.parse(curGlobal) : {};
      gObj.adminAuth = authObj;
      docProperties.setProperty("lms_global_data", JSON.stringify(gObj));
      
      output = { status: "success", message: "Admin password updated globally across all devices!", data: authObj };
    } 
    else if (payload.action === "update_settings") {
      var curGlobal = docProperties.getProperty("lms_global_data");
      var gObj = curGlobal ? JSON.parse(curGlobal) : {};
      gObj.settings = payload.settings;
      docProperties.setProperty("lms_global_data", JSON.stringify(gObj));
      
      output = { status: "success", message: "Settings updated globally across all devices!", data: payload.settings };
    }
    else if (payload.action === "sync_all") {
      docProperties.setProperty("lms_global_data", JSON.stringify(payload.data));
      if (payload.data.adminAuth) {
        docProperties.setProperty("lms_admin_auth", JSON.stringify(payload.data.adminAuth));
      }
      output = { status: "success", message: "Full system state synced to cloud globally!", data: payload.data };
    }
  } catch (err) {
    output = { status: "error", message: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}
