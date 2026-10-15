/* =================================================================
   PEPPY FASHION - COMPLETE BACKEND
   Google Apps Script / Code.gs

   Supports:
   1. Existing Website Product API
   2. Existing Checkout / Order API
   3. Customer Email
   4. Admin Email
   5. Admin Product CRUD
   6. Admin Order Management
   7. Dashboard Statistics
   8. Categories / Collections
   9. Product Cache
   10. Admin API Authentication
   11. Product Image Gallery
   12. Permanent Product Delete

   IMPORTANT:
   - Existing Google Sheet structure is preserved.
   - Existing GitHub website remains compatible.
   - Admin Panel uses the same backend.
   ================================================================= */


/* =================================================================
   0. CONFIGURATION
   ================================================================= */

const ADMIN_EMAIL = "peppyfashionbd@gmail.com";

const STORE_NAME = "Peppy Fashion";

const STORE_WHATSAPP = "+8801710868775";

const STORE_EMAIL = "peppyfashionbd@gmail.com";

const STORE_WEBSITE =
  "https://peppyfashion775.github.io/peppy-fashion-v2/";

const STORE_FACEBOOK =
  "https://www.facebook.com/peppyfashionbd";


const CACHE_KEY = "PEPPY_PRODUCTS_CACHE_V2";

const CACHE_TIME = 300;

const DRIVE_PRODUCT_FOLDER_NAME = "Peppy Fashion Product Images";

const DEFAULT_ADMIN_TOKEN =
  "CHANGE_THIS_ADMIN_TOKEN";


/* =================================================================
   1. BASIC HELPERS
   ================================================================= */

function getSpreadsheet() {

  return SpreadsheetApp.getActiveSpreadsheet();

}


function getSheet(sheetName) {

  return getSpreadsheet().getSheetByName(sheetName);

}


function safeString(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }

  return String(value).trim();

}


function safeNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return isFinite(value) ? value : 0;
  let text = String(value).trim().replace(/,/g, "").replace(/[৳$%]/g, "");
  const match = text.match(/-?\d+(?:\.\d+)?/);
  if (!match) return 0;
  const number = Number(match[0]);
  return isFinite(number) ? number : 0;
}


function normalizeYesNo(value) {

  const text =
    safeString(value).toLowerCase();

  if (
    text === "yes" ||
    text === "true" ||
    text === "1" ||
    text === "featured"
  ) {

    return "yes";

  }

  return "no";

}


function normalizeStatus(value) {

  const text =
    safeString(value).toLowerCase();

  if (
    text === "inactive" ||
    text === "disabled" ||
    text === "draft" ||
    text === "deleted"
  ) {

    return "inactive";

  }

  return "active";

}


function createJsonResponse(data) {

  return ContentService
    .createTextOutput(
      JSON.stringify(data)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );

}


function successResponse(data) {

  return createJsonResponse({

    success: true,

    ...data

  });

}


function errorResponse(message) {
  const text = String(message);
  return createJsonResponse({
    success: false,
    error: text,
    message: text
  });
}


/* =================================================================
   2. ADMIN AUTHENTICATION
   ================================================================= */

function getAdminToken() {

  const properties =
    PropertiesService.getScriptProperties();

  let savedToken =
    properties.getProperty("ADMIN_TOKEN");

  if (
    !savedToken ||
    !String(savedToken).trim()
  ) {
    savedToken =
      properties.getProperty("Admin Panel");
  }

  if (
    savedToken !== null &&
    savedToken !== undefined &&
    String(savedToken).trim()
  ) {
    return String(savedToken).trim();
  }

  return DEFAULT_ADMIN_TOKEN;
}


function isValidAdminToken(token) {

  if (
    token === null ||
    token === undefined
  ) {
    return false;
  }

  return (
    String(token).trim() ===
    String(getAdminToken()).trim()
  );
}


function requireAdmin(data) {

  const token =
    data &&
    (
      data.adminToken !== undefined
        ? data.adminToken
        : data.token
    );

  if (
    !isValidAdminToken(token)
  ) {
    throw new Error(
      "Unauthorized admin request."
    );
  }

}


function generateAdminToken() {

  const token =
    Utilities.getUuid().replace(
      /-/g,
      ""
    );

  PropertiesService
    .getScriptProperties()
    .setProperty(
      "ADMIN_TOKEN",
      token
    );

  Logger.log(
    "New ADMIN_TOKEN: " + token
  );

  return token;

}


/* =================================================================
   3. HEADER HELPERS
   ================================================================= */

function normalizeHeader(header) {

  return safeString(header)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/_/g, "");

}


function getHeaders(sheet) {

  if (
    !sheet ||
    sheet.getLastColumn() === 0
  ) {

    return [];

  }

  return sheet
    .getRange(
      1,
      1,
      1,
      sheet.getLastColumn()
    )
    .getValues()[0]
    .map(function(header) {

      return normalizeHeader(header);

    });

}


function getColumnIndex(
  headers,
  names
) {

  if (!Array.isArray(names)) {

    names = [names];

  }

  for (
    let i = 0;
    i < names.length;
    i++
  ) {

    const wanted =
      normalizeHeader(names[i]);

    const index =
      headers.indexOf(wanted);

    if (index >= 0) {

      return index;

    }

  }

  return -1;

}


function getProductColumns(sheet) {

  const headers =
    getHeaders(sheet);

  return {

    id:
      getColumnIndex(
        headers,
        ["id", "productid"]
      ),

    name:
      getColumnIndex(
        headers,
        ["name", "productname"]
      ),

    category:
      getColumnIndex(
        headers,
        [
          "maincategory",
          "category"
        ]
      ),

    subCategory:
      getColumnIndex(
        headers,
        [
          "subcategory",
          "subcategoryname"
        ]
      ),

    collection:
      getColumnIndex(
        headers,
        ["collection"]
      ),

    price:
      getColumnIndex(
        headers,
        ["price"]
      ),

    oldPrice:
      getColumnIndex(
        headers,
        [
          "oldprice",
          "originalprice"
        ]
      ),

    discount:
      getColumnIndex(
        headers,
        ["discount"]
      ),

    image:
      getColumnIndex(
        headers,
        ["image", "imageurl"]
      ),

    images:
      getColumnIndex(
        headers,
        ["images", "gallery", "imagegallery"]
      ),

    badge:
      getColumnIndex(
        headers,
        ["badge"]
      ),

    stock:
      getColumnIndex(
        headers,
        ["stock", "quantity"]
      ),

    status:
      getColumnIndex(
        headers,
        ["status"]
      ),

    sizes:
      getColumnIndex(
        headers,
        ["sizes", "size"]
      ),

    featured:
      getColumnIndex(
        headers,
        ["featured"]
      ),

    description:
      getColumnIndex(
        headers,
        ["description", "details"]
      )

  };

}


/* =================================================================
   4. PRODUCT SHEET STRUCTURE
   ================================================================= */

const REQUIRED_PRODUCT_HEADERS = [

  "ID",
  "Name",
  "Main Category",
  "Sub Category",
  "Collection",
  "Price",
  "Discount",
  "Image",
  "Images",
  "Badge",
  "Stock",
  "Status",
  "Sizes",
  "Featured",
  "Description"

];


function ensureProductColumns(sheet) {

  if (!sheet) {

    throw new Error(
      "Products sheet not found."
    );

  }

  let lastColumn =
    sheet.getLastColumn();

  if (lastColumn === 0) {

    sheet
      .getRange(
        1,
        1,
        1,
        REQUIRED_PRODUCT_HEADERS.length
      )
      .setValues([
        REQUIRED_PRODUCT_HEADERS
      ]);

    return;

  }

  let headers =
    sheet
      .getRange(
        1,
        1,
        1,
        lastColumn
      )
      .getValues()[0];

  const normalized =
    headers.map(normalizeHeader);

  REQUIRED_PRODUCT_HEADERS.forEach(
    function(requiredHeader) {

      const normalizedRequired =
        normalizeHeader(
          requiredHeader
        );

      if (
        normalized.indexOf(
          normalizedRequired
        ) === -1
      ) {

        lastColumn++;

        sheet
          .getRange(
            1,
            lastColumn
          )
          .setValue(
            requiredHeader
          );

        normalized.push(
          normalizedRequired
        );

      }

    }
  );

}


/* =================================================================
   5. IMAGE PATH NORMALIZATION
   ================================================================= */

function normalizeImagePath(
  imagePath
) {

  let imgPath =
    safeString(imagePath);

  if (!imgPath) {

    return "";

  }

  /*
   * Google Drive images need Google's direct image-delivery URL.
   * drive.google.com/uc?export=view is not reliable for <img> on
   * GitHub Pages. Convert every Drive URL to lh3.googleusercontent.com.
   */
  if (
    imgPath.indexOf("drive.google.com/") !== -1 ||
    imgPath.indexOf("docs.google.com/") !== -1 ||
    imgPath.indexOf("googleusercontent.com/") !== -1
  ) {
    const driveFileId = getDriveFileId_(imgPath);

    if (driveFileId) {
      return getDriveImageUrl_(driveFileId);
    }

    return imgPath;
  }

  if (
    imgPath.startsWith("http://") ||
    imgPath.startsWith("https://")
  ) {

    return imgPath;

  }

  if (
    imgPath.startsWith(
      "assets/images/products/"
    )
  ) {

    return imgPath;

  }

  if (
    imgPath.startsWith(
      "images/products/"
    )
  ) {

    return "assets/" + imgPath;

  }

  if (
    imgPath.startsWith("/assets/")
  ) {

    return imgPath.substring(1);

  }

  if (
    imgPath.startsWith("assets/")
  ) {

    return imgPath;

  }

  return (
    "assets/images/products/" +
    imgPath
  );

}



/* =================================================================
   STORED IMAGE VALUE
   ================================================================= */

/*
 * Google Sheet storage rule:
 *
 * Local GitHub product images are stored as filename only:
 *     tshirt-4.jpg
 *
 * Full website path is generated only when the image is read.
 *
 * External image URLs are preserved as URLs.
 */
function normalizeStoredImageValue_(imageValue) {

  let value =
    safeString(imageValue);

  if (!value) {
    return "";
  }

  /*
   * If this is a URL, keep external URLs intact.
   * For our GitHub Pages product URL, store only the filename.
   */
  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {

    const githubPrefix =
      "https://peppyfashion775.github.io/peppy-fashion-v2/";

    if (
      value.indexOf(githubPrefix) === 0
    ) {
      value =
        value.substring(
          githubPrefix.length
        );
    }
    else {
      /*
       * Other external URLs remain untouched.
       */
      return value;
    }

  }

  value =
    value.replace(/^\/+/, "");

  if (
    value.indexOf("assets/images/products/") === 0
  ) {
    return value.substring(
      "assets/images/products/".length
    );
  }

  if (
    value.indexOf("images/products/") === 0
  ) {
    return value.substring(
      "images/products/".length
    );
  }

  if (
    value.indexOf("assets/") === 0
  ) {
    const marker =
      "assets/images/products/";

    if (
      value.indexOf(marker) === 0
    ) {
      return value.substring(
        marker.length
      );
    }
  }

  return value;
}


/*
 * Normalize a gallery list for Google Sheet storage.
 */
function normalizeStoredProductImages_(images) {

  return normalizeProductImages_(
    images
  )
    .map(function(image) {
      return normalizeStoredImageValue_(
        image
      );
    })
    .filter(Boolean);

}


/* =================================================================
   6. PRODUCT CACHE
   ================================================================= */

function clearProductCache() {

  CacheService
    .getScriptCache()
    .remove(CACHE_KEY);

  Logger.log(
    "Peppy Fashion product cache cleared."
  );

}


/* =================================================================
   7. READ PRODUCTS
   ================================================================= */

function getPublicProducts() {

  const cache =
    CacheService.getScriptCache();

  const cachedData =
    cache.get(CACHE_KEY);

  if (cachedData) {

    try {

      return JSON.parse(
        cachedData
      );

    }

    catch (error) {

      cache.remove(
        CACHE_KEY
      );

    }

  }

  const ss =
    getSpreadsheet();

  const sheet =
    ss.getSheetByName(
      "Products"
    );

  if (!sheet) {

    return {

      success: false,

      error:
        "Products sheet not found"

    };

  }

  const data =
    sheet.getDataRange()
      .getValues();

  if (
    !data ||
    data.length < 2
  ) {

    const emptyResult = {

      success: true,

      products: []

    };

    cache.put(
      CACHE_KEY,
      JSON.stringify(
        emptyResult
      ),
      CACHE_TIME
    );

    return emptyResult;

  }

  const headers =
    data[0].map(
      normalizeHeader
    );

  function getColumn(name) {

    return headers.indexOf(
      normalizeHeader(name)
    );

  }

  const col = {

    id:
      getColumn("id"),

    name:
      getColumn("name"),

    category:
      getColumn("maincategory") >= 0
        ? getColumn("maincategory")
        : getColumn("category"),

    subCategory:
      getColumn("subcategory"),

    collection:
      getColumn("collection"),

    price:
      getColumn("price"),

    oldPrice:
      getColumn("oldprice"),

    discount:
      getColumn("discount"),

    image:
      getColumn("image"),

    badge:
      getColumn("badge"),

    stock:
      getColumn("stock"),

    status:
      getColumn("status"),

    sizes:
      getColumn("sizes"),

    featured:
      getColumn("featured"),

    description:
      getColumn("description"),

    images:
      getColumn("images")

  };

  const products = [];

  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    const row =
      data[i];

    const rowHasData =
      row.some(function(value) {

        return (
          value !== "" &&
          value !== null &&
          value !== undefined
        );

      });

    if (!rowHasData) {

      continue;

    }

    let status =
      "active";

    if (
      col.status >= 0
    ) {

      status =
        safeString(
          row[col.status]
        )
        .toLowerCase();

    }

    if (
      status !== "active"
    ) {

      continue;

    }

    const productId =
      col.id >= 0
        ? row[col.id]
        : "";

    const productName =
      col.name >= 0
        ? safeString(
            row[col.name]
          )
        : "";

    const category =
      col.category >= 0
        ? (
            safeString(
              row[col.category]
            ) ||
            "Others"
          )
        : "Others";

    const subCategory =
      col.subCategory >= 0
        ? (
            safeString(
              row[col.subCategory]
            ) ||
            "All"
          )
        : "All";

    const collection =
      col.collection >= 0
        ? safeString(
            row[col.collection]
          )
        : "";

    const originalPrice =
      col.price >= 0
        ? safeNumber(
            row[col.price]
          )
        : 0;

    let oldPrice = null;

    if (
      col.oldPrice >= 0
    ) {

      const oldPriceValue =
        safeNumber(
          row[col.oldPrice]
        );

      if (
        oldPriceValue > 0 &&
        oldPriceValue > originalPrice
      ) {

        oldPrice =
          oldPriceValue;

      }

    }

    const discountPercent =
      col.discount >= 0
        ? safeNumber(
            row[col.discount]
          )
        : 0;

    let finalPrice =
      originalPrice;

    if (
      discountPercent > 0
    ) {

      finalPrice =
        Math.round(
          originalPrice -
          (
            originalPrice *
            discountPercent /
            100
          )
        );

    }

    let imgPath = "";

    if (
      col.image >= 0
    ) {

      imgPath =
        normalizeImagePath(
          row[col.image]
        );

    }

    const badge =
      col.badge >= 0
        ? safeString(
            row[col.badge]
          )
        : "";

    const stock =
      col.stock >= 0
        ? safeNumber(
            row[col.stock]
          )
        : 0;

    let sizes = [];

    if (
      col.sizes >= 0 &&
      row[col.sizes]
    ) {

      sizes =
        safeString(
          row[col.sizes]
        )
        .split(",")
        .map(function(size) {

          return size.trim();

        })
        .filter(function(size) {

          return size !== "";

        });

    }

    let featured =
      "no";

    if (
      col.featured >= 0
    ) {

      featured =
        normalizeYesNo(
          row[col.featured]
        );

    }

    const description =
      col.description >= 0
        ? safeString(
            row[col.description]
          )
        : "";

    products.push({

      id:
        productId,

      name:
        productName,

      category:
        category,

      subCategory:
        subCategory,

      collection:
        collection,

      price:
        finalPrice,

      oldPrice:
        oldPrice,

      discount:
        discountPercent,

      image:
        imgPath,

      images:
        getProductImagesFromRow_(
          row,
          col,
          imgPath
        ),

      badge:
        badge,

      stock:
        stock,

      status:
        status,

      sizes:
        sizes,

      featured:
        featured,

      description:
        description

    });

  }

  const result = {

    success: true,

    products:
      products

  };

  cache.put(
    CACHE_KEY,
    JSON.stringify(
      result
    ),
    CACHE_TIME
  );

  return result;

}


/* =================================================================
   8. GET ALL PRODUCTS FOR ADMIN
   ================================================================= */

function getAllProductsForAdmin() {

  const sheet =
    getSheet("Products");

  if (!sheet) {

    throw new Error(
      "Products sheet not found."
    );

  }

  const data =
    sheet.getDataRange()
      .getValues();

  if (
    data.length < 2
  ) {

    return [];

  }

  const col =
    getProductColumns(
      sheet
    );

  const products = [];

  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    const row =
      data[i];

    const hasData =
      row.some(function(value) {

        return (
          value !== "" &&
          value !== null &&
          value !== undefined
        );

      });

    if (!hasData) {

      continue;

    }

    const product = {

      rowNumber:
        i + 1,

      id:
        col.id >= 0
          ? row[col.id]
          : "",

      name:
        col.name >= 0
          ? safeString(
              row[col.name]
            )
          : "",

      category:
        col.category >= 0
          ? safeString(
              row[col.category]
            )
          : "",

      subCategory:
        col.subCategory >= 0
          ? safeString(
              row[col.subCategory]
            )
          : "",

      collection:
        col.collection >= 0
          ? safeString(
              row[col.collection]
            )
          : "",

      price:
        col.price >= 0
          ? safeNumber(
              row[col.price]
            )
          : 0,

      oldPrice:
        col.oldPrice >= 0
          ? safeNumber(
              row[col.oldPrice]
            ) || null
          : null,

      discount:
        col.discount >= 0
          ? safeNumber(
              row[col.discount]
            )
          : 0,

      image:
        col.image >= 0
          ? safeString(
              row[col.image]
            )
          : "",

      images:
        getProductImagesFromRow_(
          row,
          col,
          col.image >= 0
            ? safeString(row[col.image])
            : ""
        ),

      badge:
        col.badge >= 0
          ? safeString(
              row[col.badge]
            )
          : "",

      stock:
        col.stock >= 0
          ? safeNumber(
              row[col.stock]
            )
          : 0,

      status:
        col.status >= 0
          ? normalizeStatus(
              row[col.status]
            )
          : "active",

      sizes:
        col.sizes >= 0
          ? safeString(
              row[col.sizes]
            )
          : "",

      featured:
        col.featured >= 0
          ? normalizeYesNo(
              row[col.featured]
            )
          : "no",

      description:
        col.description >= 0
          ? safeString(
              row[col.description]
            )
          : ""

    };

    products.push(
      product
    );

  }

  return products;

}


/* =================================================================
   9. FIND PRODUCT ROW
   ================================================================= */

function findProductRow(
  productId
) {

  const sheet =
    getSheet("Products");

  if (!sheet) {

    throw new Error(
      "Products sheet not found."
    );

  }

  const col =
    getProductColumns(
      sheet
    );

  if (
    col.id < 0
  ) {

    throw new Error(
      "ID column not found in Products sheet."
    );

  }

  const lastRow =
    sheet.getLastRow();

  if (
    lastRow < 2
  ) {

    return -1;

  }

  const values =
    sheet
      .getRange(
        2,
        col.id + 1,
        lastRow - 1,
        1
      )
      .getValues();

  for (
    let i = 0;
    i < values.length;
    i++
  ) {

    if (
      String(values[i][0]).trim() ===
      String(productId).trim()
    ) {

      return i + 2;

    }

  }

  return -1;

}


/* =================================================================
   10. GENERATE PRODUCT ID
   ================================================================= */

function generateProductId() {

  const sheet =
    getSheet("Products");

  if (!sheet) {

    throw new Error(
      "Products sheet not found."
    );

  }

  const col =
    getProductColumns(
      sheet
    );

  if (
    col.id < 0
  ) {

    return 1;

  }

  const lastRow =
    sheet.getLastRow();

  if (
    lastRow < 2
  ) {

    return 1;

  }

  const values =
    sheet
      .getRange(
        2,
        col.id + 1,
        lastRow - 1,
        1
      )
      .getValues();

  let maxId = 0;

  values.forEach(
    function(row) {

      const number =
        Number(row[0]);

      if (
        !isNaN(number) &&
        number > maxId
      ) {

        maxId =
          number;

      }

    }
  );

  return maxId + 1;

}


/* =================================================================
   11. WRITE PRODUCT VALUE
   ================================================================= */

function writeProductToRow(
  sheet,
  rowNumber,
  product
) {

  ensureProductColumns(
    sheet
  );

  const col =
    getProductColumns(
      sheet
    );

  if (
    col.id >= 0 &&
    product.id !== undefined
  ) {

    sheet
      .getRange(
        rowNumber,
        col.id + 1
      )
      .setValue(
        product.id
      );

  }

  if (
    col.name >= 0
  ) {

    sheet
      .getRange(
        rowNumber,
        col.name + 1
      )
      .setValue(
        safeString(
          product.name
        )
      );

  }

  if (
    col.category >= 0
  ) {

    sheet
      .getRange(
        rowNumber,
        col.category + 1
      )
      .setValue(
        safeString(
          product.category
        )
      );

  }

  if (
    col.subCategory >= 0
  ) {

    sheet
      .getRange(
        rowNumber,
        col.subCategory + 1
      )
      .setValue(
        safeString(
          product.subCategory
        )
      );

  }

  if (
    col.collection >= 0
  ) {

    sheet
      .getRange(
        rowNumber,
        col.collection + 1
      )
      .setValue(
        safeString(
          product.collection
        )
      );

  }

  if (
    col.price >= 0
  ) {

    sheet
      .getRange(
        rowNumber,
        col.price + 1
      )
      .setValue(
        safeNumber(
          product.price
        )
      );

  }

  if (
    col.oldPrice >= 0
  ) {

    const oldPrice =
      safeNumber(
        product.oldPrice
      );

    sheet
      .getRange(
        rowNumber,
        col.oldPrice + 1
      )
      .setValue(
        oldPrice > 0
          ? oldPrice
          : ""
      );

  }

  if (
    col.discount >= 0
  ) {

    sheet
      .getRange(
        rowNumber,
        col.discount + 1
      )
      .setValue(
        safeNumber(
          product.discount
        )
      );

  }

  /*
   * IMAGE
   *
   * Store filename only for local product images.
   */
  if (
    col.image >= 0
  ) {

    sheet
      .getRange(
        rowNumber,
        col.image + 1
      )
      .setValue(
        normalizeStoredImageValue_(
          product.image
        )
      );

  }

  /*
   * IMAGES / GALLERY
   *
   * Store filename-only values as JSON.
   */
  if (
    col.images >= 0 &&
    product.images !== undefined
  ) {

    sheet
      .getRange(
        rowNumber,
        col.images + 1
      )
      .setValue(
        JSON.stringify(
          normalizeStoredProductImages_(
            product.images
          )
        )
      );

  }

  if (
    col.badge >= 0
  ) {

    sheet
      .getRange(
        rowNumber,
        col.badge + 1
      )
      .setValue(
        safeString(
          product.badge
        )
      );

  }

  if (
    col.stock >= 0
  ) {

    sheet
      .getRange(
        rowNumber,
        col.stock + 1
      )
      .setValue(
        Math.max(
          0,
          safeNumber(
            product.stock
          )
        )
      );

  }

  if (
    col.status >= 0
  ) {

    sheet
      .getRange(
        rowNumber,
        col.status + 1
      )
      .setValue(
        normalizeStatus(
          product.status
        )
      );

  }

  if (
    col.sizes >= 0
  ) {

    let sizes = "";

    if (
      Array.isArray(
        product.sizes
      )
    ) {

      sizes =
        product.sizes
          .map(function(size) {

            return safeString(
              size
            );

          })
          .filter(function(size) {

            return size !== "";

          })
          .join(", ");

    }

    else {

      sizes =
        safeString(
          product.sizes
        );

    }

    sheet
      .getRange(
        rowNumber,
        col.sizes + 1
      )
      .setValue(
        sizes
      );

  }

  if (
    col.featured >= 0
  ) {

    sheet
      .getRange(
        rowNumber,
        col.featured + 1
      )
      .setValue(
        normalizeYesNo(
          product.featured
        )
      );

  }

  if (
    col.description >= 0
  ) {

    sheet
      .getRange(
        rowNumber,
        col.description + 1
      )
      .setValue(
        safeString(
          product.description
        )
      );

  }

}


/* =================================================================
   12. ADD PRODUCT
   ================================================================= */

function addProduct(
  data
) {

  requireAdmin(
    data
  );

  const lock =
    LockService
      .getScriptLock();

  lock.waitLock(
    15000
  );

  try {

    const sheet =
      getSheet("Products");

    if (!sheet) {

      throw new Error(
        "Products sheet not found."
      );

    }

    ensureProductColumns(
      sheet
    );

    const productId =
      data.id ||
      generateProductId();

    if (
      findProductRow(
        productId
      ) !== -1
    ) {

      throw new Error(
        "Product ID already exists: " +
        productId
      );

    }

    const rowNumber =
      sheet.getLastRow() + 1;

    const product = {

      id:
        productId,

      name:
        data.name || "",

      category:
        data.category ||
        data.mainCategory ||
        "Others",

      subCategory:
        data.subCategory ||
        "All",

      collection:
        data.collection ||
        "",

      price:
        data.price || 0,

      oldPrice:
        data.oldPrice ||
        "",

      discount:
        data.discount ||
        0,

      image:
        data.image ||
        "",

      images:
        data.images !== undefined
          ? data.images
          : [],

      badge:
        data.badge ||
        "",

      stock:
        data.stock ||
        0,

      status:
        data.status ||
        "active",

      sizes:
        data.sizes ||
        [],

      featured:
        data.featured ||
        "no",

      description:
        data.description ||
        ""

    };

    writeProductToRow(
      sheet,
      rowNumber,
      product
    );

    clearProductCache();

    return {

      product:
        product,

      message:
        "Product added successfully."

    };

  }

  finally {

    lock.releaseLock();

  }

}


/* =================================================================
   13. UPDATE PRODUCT
   ================================================================= */

function updateProduct(
  data
) {

  requireAdmin(
    data
  );

  const productId =
    data.id;

  if (
    productId === undefined ||
    productId === null ||
    productId === ""
  ) {

    throw new Error(
      "Product ID is required."
    );

  }

  const lock =
    LockService
      .getScriptLock();

  lock.waitLock(
    15000
  );

  try {

    const sheet =
      getSheet("Products");

    if (!sheet) {

      throw new Error(
        "Products sheet not found."
      );

    }

    const rowNumber =
      findProductRow(
        productId
      );

    if (
      rowNumber === -1
    ) {

      throw new Error(
        "Product not found: " +
        productId
      );

    }

    const current =
      getProductByRow(
        sheet,
        rowNumber
      );

    const product = {

      id:
        productId,

      name:
        data.name !== undefined
          ? data.name
          : current.name,

      category:
        data.category !== undefined
          ? data.category
          : current.category,

      subCategory:
        data.subCategory !== undefined
          ? data.subCategory
          : current.subCategory,

      collection:
        data.collection !== undefined
          ? data.collection
          : current.collection,

      price:
        data.price !== undefined
          ? data.price
          : current.price,

      oldPrice:
        data.oldPrice !== undefined
          ? data.oldPrice
          : current.oldPrice,

      discount:
        data.discount !== undefined
          ? data.discount
          : current.discount,

      image:
        data.image !== undefined
          ? data.image
          : current.image,

      images:
        data.images !== undefined
          ? data.images
          : current.images,

      badge:
        data.badge !== undefined
          ? data.badge
          : current.badge,

      stock:
        data.stock !== undefined
          ? data.stock
          : current.stock,

      status:
        data.status !== undefined
          ? data.status
          : current.status,

      sizes:
        data.sizes !== undefined
          ? data.sizes
          : current.sizes,

      featured:
        data.featured !== undefined
          ? data.featured
          : current.featured,

      description:
        data.description !== undefined
          ? data.description
          : current.description

    };

    writeProductToRow(
      sheet,
      rowNumber,
      product
    );

    clearProductCache();

    return {

      product:
        product,

      message:
        "Product updated successfully."

    };

  }

  finally {

    lock.releaseLock();

  }

}


/* =================================================================
   14. GET PRODUCT BY ROW
   ================================================================= */

function getProductByRow(
  sheet,
  rowNumber
) {

  const col =
    getProductColumns(
      sheet
    );

  const row =
    sheet
      .getRange(
        rowNumber,
        1,
        1,
        sheet.getLastColumn()
      )
      .getValues()[0];

  return {

    id:
      col.id >= 0
        ? row[col.id]
        : "",

    name:
      col.name >= 0
        ? safeString(
            row[col.name]
          )
        : "",

    category:
      col.category >= 0
        ? safeString(
            row[col.category]
          )
        : "",

    subCategory:
      col.subCategory >= 0
        ? safeString(
            row[col.subCategory]
          )
        : "",

    collection:
      col.collection >= 0
        ? safeString(
            row[col.collection]
          )
        : "",

    price:
      col.price >= 0
        ? safeNumber(
            row[col.price]
          )
        : 0,

    oldPrice:
      col.oldPrice >= 0
        ? safeNumber(
            row[col.oldPrice]
          )
        : null,

    discount:
      col.discount >= 0
        ? safeNumber(
            row[col.discount]
          )
        : 0,

    image:
      col.image >= 0
        ? safeString(
            row[col.image]
          )
        : "",

    images:
      getProductImagesFromRow_(
        row,
        col,
        col.image >= 0
          ? safeString(row[col.image])
          : ""
      ),

    badge:
      col.badge >= 0
        ? safeString(
            row[col.badge]
          )
        : "",

    stock:
      col.stock >= 0
        ? safeNumber(
            row[col.stock]
          )
        : 0,

    status:
      col.status >= 0
        ? normalizeStatus(
            row[col.status]
          )
        : "active",

    sizes:
      col.sizes >= 0
        ? safeString(
            row[col.sizes]
          )
        : "",

    featured:
      col.featured >= 0
        ? normalizeYesNo(
            row[col.featured]
          )
        : "no",

    description:
      col.description >= 0
        ? safeString(
            row[col.description]
          )
        : ""

  };

}


/* =================================================================
   PRODUCT IMAGE GALLERY HELPERS
   ================================================================= */

function ensureImageGalleryColumn_(sheet) {

  const headers =
    getHeaders(sheet);

  let idx =
    getColumnIndex(
      headers,
      [
        "images",
        "gallery",
        "imagegallery"
      ]
    );

  if (
    idx >= 0
  ) {

    return idx;

  }

  const newCol =
    sheet.getLastColumn() + 1;

  sheet
    .getRange(
      1,
      newCol
    )
    .setValue(
      "Images"
    );

  return newCol - 1;

}


function normalizeProductImages_(images) {

  let list = [];

  if (
    Array.isArray(images)
  ) {

    list = images;

  }

  else if (
    typeof images === "string"
  ) {

    const text =
      images.trim();

    if (!text) {

      return [];

    }

    try {

      const parsed =
        JSON.parse(text);

      list =
        Array.isArray(parsed)
          ? parsed
          : text.split(/\s*[|\n]\s*/);

    }

    catch (err) {

      list =
        text.split(/\s*[|\n]\s*/);

    }

  }

  return list
    .map(function(v) {

      return safeString(v);

    })
    .filter(Boolean);

}


function getProductImagesFromRow_(
  row,
  col,
  primaryImage
) {

  let list = [];

  if (
    col.images >= 0
  ) {

    list =
      normalizeProductImages_(
        row[col.images]
      );

  }

  if (
    !list.length &&
    primaryImage
  ) {

    list = [
      primaryImage
    ];

  }

  return list.map(
    normalizeImagePath
  );

}


function updateProductImages_(
  data
) {

  requireAdmin(
    data
  );

  const productId =
    data.id;

  if (
    productId === undefined ||
    productId === null ||
    productId === ""
  ) {
    throw new Error(
      "Product ID is required."
    );
  }

  const sheet =
    getSheet("Products");

  const rowNumber =
    findProductRow(
      productId
    );

  if (
    rowNumber === -1
  ) {
    throw new Error(
      "Product not found: " +
      productId
    );
  }

  /*
   * Convert all local GitHub image values to
   * filename-only values before storing them.
   */
  const images =
    normalizeStoredProductImages_(
      data.images
    );

  const galleryCol =
    ensureImageGalleryColumn_(
      sheet
    );

  const imageCol =
    getProductColumns(
      sheet
    ).image;

  sheet
    .getRange(
      rowNumber,
      galleryCol + 1
    )
    .setValue(
      JSON.stringify(images)
    );

  /*
   * Image column always stores the primary filename only.
   */
  if (
    imageCol >= 0
  ) {

    sheet
      .getRange(
        rowNumber,
        imageCol + 1
      )
      .setValue(
        images.length
          ? images[0]
          : ""
      );

  }

  clearProductCache();

  return {
    message:
      "Product images updated.",
    product:
      getProductByRow(
        sheet,
        rowNumber
      )
  };

}


/* =================================================================
   GOOGLE DRIVE PRODUCT IMAGE HELPERS
   ================================================================= */

function getDriveProductFolder_() {
  const folders = DriveApp.getFoldersByName(DRIVE_PRODUCT_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(DRIVE_PRODUCT_FOLDER_NAME);
}

/* =================================================================
   DRIVE AUTHORIZATION HELPER
   Run this function once from Apps Script to authorize Drive access.
   It also creates the product-image folder if it does not exist.
   ================================================================= */
function authorizeDrive() {
  const folder = getDriveProductFolder_();
  return {
    success: true,
    message: "Google Drive access authorized successfully.",
    folderName: folder.getName(),
    folderId: folder.getId()
  };
}

function getDriveFileId_(value) {
  const text = safeString(value);
  if (!text) return "";
  let match = text.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  match = text.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  return "";
}

function getDriveImageUrl_(fileId) {
  return "https://lh3.googleusercontent.com/d/" + encodeURIComponent(fileId);
}

function getMimeTypeForImage_(filename) {
  const name = safeString(filename).toLowerCase();
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

function isDriveImageValue_(value) {
  const text = safeString(value).toLowerCase();
  return text.indexOf("drive.google.com/") !== -1 || text.indexOf("docs.google.com/") !== -1;
}


/* =================================================================
   GOOGLE DRIVE IMAGE UPLOAD
   ================================================================= */

/* Function name remains uploadImageToGitHub_ for existing Admin Panel compatibility. */
function uploadImageToGitHub_(data) {
  requireAdmin(data);

  const filename = sanitizeFilename_(data.filename || "product-image.jpg");
  const base64 = safeString(data.base64).replace(/^data:[^;]+;base64,/i, "");
  if (!base64) throw new Error("Image data is missing.");

  let bytes;
  try {
    bytes = Utilities.base64Decode(base64);
  } catch (error) {
    throw new Error("Invalid image data.");
  }
  if (!bytes || !bytes.length) throw new Error("Image data is empty.");

  const blob = Utilities.newBlob(bytes, getMimeTypeForImage_(filename), filename);
  const folder = getDriveProductFolder_();
  const file = folder.createFile(blob);

  /* GitHub Pages needs a publicly viewable image URL. */
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  const fileId = file.getId();
  const imageUrl = getDriveImageUrl_(fileId);

  return {
    success: true,
    storage: "google-drive",
    folder: DRIVE_PRODUCT_FOLDER_NAME,
    filename: filename,
    fileId: fileId,
    path: imageUrl,
    image: imageUrl,
    url: imageUrl
  };
}


function sanitizeFilename_(name) {
  let s = safeString(name)
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase();

  if (!s) {
    s = "product-image.jpg";
  }

  return s;
}


/* =================================================================
   PRODUCT IMAGE DELETE
   ================================================================= */

/* Drive images are trashed. Legacy GitHub images remain untouched. */
function deleteImageFromGitHub_(data) {
  requireAdmin(data);

  const value = safeString(data.path || data.image || data.url);
  if (!value) throw new Error("Image path or URL is required.");

  if (isDriveImageValue_(value)) {
    const fileId = getDriveFileId_(value);
    if (!fileId) throw new Error("Unable to determine Google Drive file ID.");
    try {
      const file = DriveApp.getFileById(fileId);
      file.setTrashed(true);
      return { success:true, storage:"google-drive", deleted:true, fileId:fileId, message:"Google Drive product image deleted." };
    } catch (error) {
      throw new Error("Unable to delete Google Drive image: " + error.message);
    }
  }

  if (
    value.indexOf("assets/images/products/") === 0 ||
    value.indexOf("images/products/") === 0 ||
    value.indexOf("https://peppyfashion775.github.io/peppy-fashion-v2/assets/images/products/") === 0
  ) {
    return { success:true, storage:"github-legacy", deleted:false, message:"Legacy GitHub product image was kept unchanged." };
  }

  throw new Error("Only Google Drive or legacy product images can be processed.");
}


/* =================================================================
   15. DELETE / DEACTIVATE PRODUCT
   ================================================================= */

function deleteProduct(
  data
) {

  requireAdmin(
    data
  );

  const productId =
    data.id;

  if (
    productId === undefined ||
    productId === null ||
    productId === ""
  ) {

    throw new Error(
      "Product ID is required."
    );

  }

  const lock =
    LockService
      .getScriptLock();

  lock.waitLock(
    15000
  );

  try {

    const sheet =
      getSheet("Products");

    const rowNumber =
      findProductRow(
        productId
      );

    if (
      rowNumber === -1
    ) {

      throw new Error(
        "Product not found."
      );

    }

    const col =
      getProductColumns(
        sheet
      );

    if (
      col.status < 0
    ) {

      throw new Error(
        "Status column not found."
      );

    }

    sheet
      .getRange(
        rowNumber,
        col.status + 1
      )
      .setValue(
        "inactive"
      );

    clearProductCache();

    return {

      message:
        "Product deactivated successfully."

    };

  }

  finally {

    lock.releaseLock();

  }

}


/* =================================================================
   16. RESTORE PRODUCT
   ================================================================= */

function restoreProduct(
  data
) {

  requireAdmin(
    data
  );

  const productId =
    data.id;

  if (!productId) {

    throw new Error(
      "Product ID is required."
    );

  }

  const lock =
    LockService
      .getScriptLock();

  lock.waitLock(
    15000
  );

  try {

    const sheet =
      getSheet("Products");

    const rowNumber =
      findProductRow(
        productId
      );

    if (
      rowNumber === -1
    ) {

      throw new Error(
        "Product not found."
      );

    }

    const col =
      getProductColumns(
        sheet
      );

    if (
      col.status < 0
    ) {

      throw new Error(
        "Status column not found."
      );

    }

    sheet
      .getRange(
        rowNumber,
        col.status + 1
      )
      .setValue(
        "active"
      );

    clearProductCache();

    return {

      message:
        "Product restored successfully."

    };

  }

  finally {

    lock.releaseLock();

  }

}


/* =================================================================
   17. PERMANENT DELETE PRODUCT
   ================================================================= */

/*
 * IMPORTANT:
 *
 * Permanent delete is allowed ONLY for inactive products.
 *
 * This function:
 *
 * 1. Authenticates admin.
 * 2. Finds the product.
 * 3. Verifies that it is inactive.
 * 4. Collects all images referenced by the product.
 * 5. Deletes those product images from GitHub.
 * 6. Permanently deletes the product row from Google Sheet.
 * 7. Clears product cache.
 *
 * If an image deletion fails, the Sheet row is NOT deleted.
 *
 * NOTE:
 * Only images referenced by the product's Image / Images
 * columns are deleted. Unreferenced GitHub files are not guessed
 * or deleted automatically.
 */
function permanentDeleteProduct(
  data
) {

  requireAdmin(
    data
  );

  const productId =
    data.id;

  if (
    productId === undefined ||
    productId === null ||
    productId === ""
  ) {

    throw new Error(
      "Product ID is required."
    );

  }

  const lock =
    LockService
      .getScriptLock();

  lock.waitLock(
    30000
  );

  try {

    const sheet =
      getSheet("Products");

    if (!sheet) {

      throw new Error(
        "Products sheet not found."
      );

    }

    const rowNumber =
      findProductRow(
        productId
      );

    if (
      rowNumber === -1
    ) {

      throw new Error(
        "Product not found."
      );

    }

    const product =
      getProductByRow(
        sheet,
        rowNumber
      );

    /*
     * Safety check:
     * Permanent delete is allowed only
     * after the product has been deactivated.
     */
    if (
      product.status !== "inactive"
    ) {

      throw new Error(
        "Permanent delete is allowed only for inactive products. Deactivate the product first."
      );

    }

    /*
     * Collect all referenced images.
     */
    let imagePaths = [];

    if (
      product.image
    ) {

      imagePaths.push(
        product.image
      );

    }

    if (
      Array.isArray(
        product.images
      )
    ) {

      imagePaths =
        imagePaths.concat(
          product.images
        );

    }

    /*
     * Normalize and deduplicate image paths.
     */
    const normalizedImages = [];

    const seenImages = {};

    imagePaths.forEach(
      function(imagePath) {

        const normalized =
          normalizeImagePath(
            imagePath
          );

        if (
          !normalized
        ) {

          return;

        }

        /*
         * Collect both new Google Drive image URLs and legacy GitHub
         * product paths. The delete helper removes Drive files and
         * deliberately keeps legacy GitHub files untouched.
         */
        const isLegacyGithub =
          normalized.indexOf("assets/images/products/") === 0 ||
          normalized.indexOf("images/products/") === 0 ||
          normalized.indexOf("https://peppyfashion775.github.io/peppy-fashion-v2/assets/images/products/") === 0;

        if (
          !isLegacyGithub &&
          !isDriveImageValue_(normalized)
        ) {

          return;

        }

        if (!seenImages[normalized]) {
          seenImages[normalized] = true;
          normalizedImages.push(normalized);
        }

      }
    );

    /*
     * Permanently remove the product from the Sheet.
     *
     * Image cleanup is attempted independently. A stale/missing
     * GitHub image must NEVER prevent the product row itself from
     * being permanently deleted.
     */
    const deletedImages = [];
    const imageDeleteErrors = [];

    for (
      let i = 0;
      i < normalizedImages.length;
      i++
    ) {

      const imagePath =
        normalizedImages[i];

      try {

        const result =
          deleteImageFromGitHub_({

            adminToken:
              data.adminToken ||
              data.token,

            path:
              imagePath

          });

        if (
          result &&
          result.deleted
        ) {

          deletedImages.push(
            imagePath
          );

        }

      }

      catch (imageError) {

        imageDeleteErrors.push({
          path: imagePath,
          error: String(imageError)
        });

      }

    }

    /*
     * This is the actual permanent product deletion.
     * Do this even when an old GitHub image cannot be removed.
     */
    sheet.deleteRow(
      rowNumber
    );

    clearProductCache();

    return {

      message:
        imageDeleteErrors.length
          ? "Product permanently deleted. Some product images could not be cleaned up."
          : "Product permanently deleted successfully.",

      productId:
        productId,

      deletedImages:
        deletedImages,

      deletedImageCount:
        deletedImages.length,

      imageDeleteErrors:
        imageDeleteErrors

    };

  }

  finally {

    lock.releaseLock();

  }

}


/* =================================================================
   18. QUICK PRODUCT STATUS UPDATE
   ================================================================= */

function updateProductStatus(
  data
) {

  requireAdmin(
    data
  );

  const productId =
    data.id;

  const status =
    normalizeStatus(
      data.status
    );

  if (
    !productId
  ) {

    throw new Error(
      "Product ID is required."
    );

  }

  const sheet =
    getSheet("Products");

  const rowNumber =
    findProductRow(
      productId
    );

  if (
    rowNumber === -1
  ) {

    throw new Error(
      "Product not found."
    );

  }

  const col =
    getProductColumns(
      sheet
    );

  if (
    col.status < 0
  ) {

    throw new Error(
      "Status column not found."
    );

  }

  sheet
    .getRange(
      rowNumber,
      col.status + 1
    )
    .setValue(
      status
    );

  clearProductCache();

  return {

    message:
      "Product status updated.",

    status:
      status

  };

}


/* =================================================================
   19. UPDATE STOCK
   ================================================================= */

function updateProductStock(
  data
) {

  requireAdmin(
    data
  );

  const productId =
    data.id;

  const stock =
    Math.max(
      0,
      safeNumber(
        data.stock
      )
    );

  if (
    !productId
  ) {

    throw new Error(
      "Product ID is required."
    );

  }

  const sheet =
    getSheet("Products");

  const rowNumber =
    findProductRow(
      productId
    );

  if (
    rowNumber === -1
  ) {

    throw new Error(
      "Product not found."
    );

  }

  const col =
    getProductColumns(
      sheet
    );

  if (
    col.stock < 0
  ) {

    throw new Error(
      "Stock column not found."
    );

  }

  sheet
    .getRange(
      rowNumber,
      col.stock + 1
    )
    .setValue(
      stock
    );

  clearProductCache();

  return {

    message:
      "Stock updated successfully.",

    stock:
      stock

  };

}


/* =================================================================
   20. UPDATE FEATURED
   ================================================================= */

function updateProductFeatured(
  data
) {

  requireAdmin(
    data
  );

  const productId =
    data.id;

  if (
    !productId
  ) {

    throw new Error(
      "Product ID is required."
    );

  }

  const sheet =
    getSheet("Products");

  const rowNumber =
    findProductRow(
      productId
    );

  if (
    rowNumber === -1
  ) {

    throw new Error(
      "Product not found."
    );

  }

  const col =
    getProductColumns(
      sheet
    );

  if (
    col.featured < 0
  ) {

    throw new Error(
      "Featured column not found."
    );

  }

  const featured =
    normalizeYesNo(
      data.featured
    );

  sheet
    .getRange(
      rowNumber,
      col.featured + 1
    )
    .setValue(
      featured
    );

  clearProductCache();

  return {

    message:
      "Featured status updated.",

    featured:
      featured

  };

}


/* =================================================================
   21. ORDERS SHEET
   ================================================================= */

const ORDER_HEADERS = [

  "Date",
  "Order ID",
  "Customer Name",
  "Phone",
  "Email",
  "Address",
  "Products",
  "Quantity",
  "Subtotal",
  "Discount",
  "Delivery Charge",
  "Total",
  "Payment Method",
  "Transaction ID",
  "Order Note",
  "Status"

];


function getOrCreateOrdersSheet() {

  const ss =
    getSpreadsheet();

  let sheet =
    ss.getSheetByName(
      "Orders"
    );

  if (!sheet) {

    sheet =
      ss.insertSheet(
        "Orders"
      );

    sheet
      .getRange(
        1,
        1,
        1,
        ORDER_HEADERS.length
      )
      .setValues([
        ORDER_HEADERS
      ]);

  }

  return sheet;

}


/* =================================================================
   22. READ ORDERS
   ================================================================= */

function orderRowToObject(
  headers,
  row,
  rowNumber
) {

  function get(names) {

    const index =
      getColumnIndex(
        headers,
        names
      );

    if (
      index < 0
    ) {

      return "";

    }

    return row[index];

  }

  return {

    rowNumber:
      rowNumber,

    date:
      get([
        "date",
        "orderdate"
      ]),

    orderId:
      safeString(
        get([
          "orderid",
          "id"
        ])
      ),

    name:
      safeString(
        get([
          "customername",
          "name"
        ])
      ),

    phone:
      safeString(
        get([
          "phone"
        ])
      ),

    email:
      safeString(
        get([
          "email"
        ])
      ),

    address:
      safeString(
        get([
          "address"
        ])
      ),

    products:
      safeString(
        get([
          "products",
          "items"
        ])
      ),

    quantity:
      safeNumber(
        get([
          "quantity",
          "qty"
        ])
      ),

    subtotal:
      safeNumber(
        get([
          "subtotal"
        ])
      ),

    discount:
      safeNumber(
        get([
          "discount"
        ])
      ),

    delivery:
      safeNumber(
        get([
          "deliverycharge",
          "delivery"
        ])
      ),

    total:
      safeNumber(
        get([
          "total"
        ])
      ),

    payment:
      safeString(
        get([
          "paymentmethod",
          "payment"
        ])
      ),

    transactionId:
      safeString(
        get([
          "transactionid",
          "transaction"
        ])
      ),

    note:
      safeString(
        get([
          "ordernote",
          "note"
        ])
      ),

    status:
      safeString(
        get([
          "status"
        ])
      ) ||
      "Pending"

  };

}


function getAllOrders() {

  const sheet =
    getOrCreateOrdersSheet();

  const data =
    sheet.getDataRange()
      .getValues();

  if (
    data.length < 2
  ) {

    return [];

  }

  const headers =
    data[0].map(
      normalizeHeader
    );

  const orders = [];

  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    const row =
      data[i];

    const hasData =
      row.some(function(value) {

        return (
          value !== "" &&
          value !== null &&
          value !== undefined
        );

      });

    if (!hasData) {

      continue;

    }

    orders.push(
      orderRowToObject(
        headers,
        row,
        i + 1
      )
    );

  }

  orders.reverse();

  return orders;

}


/* =================================================================
   23. FIND ORDER ROW
   ================================================================= */

function findOrderRow(
  orderId
) {

  const sheet =
    getOrCreateOrdersSheet();

  const headers =
    getHeaders(
      sheet
    );

  const orderIdColumn =
    getColumnIndex(
      headers,
      [
        "orderid",
        "id"
      ]
    );

  if (
    orderIdColumn < 0
  ) {

    throw new Error(
      "Order ID column not found."
    );

  }

  const lastRow =
    sheet.getLastRow();

  if (
    lastRow < 2
  ) {

    return -1;

  }

  const values =
    sheet
      .getRange(
        2,
        orderIdColumn + 1,
        lastRow - 1,
        1
      )
      .getValues();

  for (
    let i = 0;
    i < values.length;
    i++
  ) {

    if (
      String(values[i][0]).trim() ===
      String(orderId).trim()
    ) {

      return i + 2;

    }

  }

  return -1;

}


/* =================================================================
   24. UPDATE ORDER STATUS
   ================================================================= */

function updateOrderStatus(
  data
) {

  requireAdmin(data);

  const orderId = data.orderId;
  const status = safeString(data.status);

  if (!orderId) throw new Error("Order ID is required.");
  if (!status) throw new Error("Order status is required.");

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const sheet = getOrCreateOrdersSheet();
    const rowNumber = findOrderRow(orderId);
    if (rowNumber === -1) throw new Error("Order not found.");

    const headers = getHeaders(sheet);
    const statusColumn = getColumnIndex(headers, ["status"]);
    if (statusColumn < 0) throw new Error("Status column not found.");

    const oldStatus = safeString(sheet.getRange(rowNumber, statusColumn + 1).getValue()).toLowerCase();
    const newStatus = status.toLowerCase();

    if ((newStatus === "cancelled" || newStatus === "canceled") &&
        oldStatus !== "cancelled" && oldStatus !== "canceled") {
      restoreStockForCancelledOrder_(orderId);
    }

    if ((oldStatus === "cancelled" || oldStatus === "canceled") &&
        newStatus !== "cancelled" && newStatus !== "canceled") {
      const props = PropertiesService.getScriptProperties();
      const storedItems = props.getProperty(getOrderItemsKey_(orderId));
      if (storedItems) {
        let items;
        try { items = JSON.parse(storedItems); }
        catch (error) { throw new Error("Unable to reserve stock: invalid stored order items."); }
        if (Array.isArray(items)) {
          adjustProductStockForOrder_(items, "deduct");
          props.setProperty(getOrderStockKey_(orderId), "1");
        }
      }
    }

    sheet.getRange(rowNumber, statusColumn + 1).setValue(status);

    return {
      message: "Order status updated.",
      orderId: orderId,
      status: status
    };
  }
  finally {
    lock.releaseLock();
  }
}


/* =================================================================
   25. DASHBOARD STATISTICS
   ================================================================= */

function getDashboardStats() {

  const products =
    getAllProductsForAdmin();

  const orders =
    getAllOrders();

  let activeProducts = 0;
  let inactiveProducts = 0;
  let outOfStock = 0;
  let lowStock = 0;
  let featuredProducts = 0;

  products.forEach(
    function(product) {

      if (
        product.status === "active"
      ) {

        activeProducts++;

      }

      else {

        inactiveProducts++;

      }

      if (
        Number(product.stock) <= 0
      ) {

        outOfStock++;

      }

      else if (
        Number(product.stock) <= 5
      ) {

        lowStock++;

      }

      if (
        product.featured === "yes"
      ) {

        featuredProducts++;

      }

    }
  );

  let pendingOrders = 0;
  let confirmedOrders = 0;
  let processingOrders = 0;
  let shippedOrders = 0;
  let deliveredOrders = 0;
  let cancelledOrders = 0;
  let totalSales = 0;

  orders.forEach(
    function(order) {

      const status =
        safeString(
          order.status
        ).toLowerCase();

      if (
        status === "pending"
      ) {

        pendingOrders++;

      }

      else if (
        status === "confirmed"
      ) {

        confirmedOrders++;

      }

      else if (
        status === "processing"
      ) {

        processingOrders++;

      }

      else if (
        status === "shipped"
      ) {

        shippedOrders++;

      }

      else if (
        status === "delivered"
      ) {

        deliveredOrders++;

      }

      else if (
        status === "cancelled" ||
        status === "canceled"
      ) {

        cancelledOrders++;

      }

      if (
        status !== "cancelled" &&
        status !== "canceled"
      ) {

        totalSales +=
          safeNumber(
            order.total
          );

      }

    }
  );

  return {

    products: {

      total:
        products.length,

      active:
        activeProducts,

      inactive:
        inactiveProducts,

      outOfStock:
        outOfStock,

      lowStock:
        lowStock,

      featured:
        featuredProducts

    },

    orders: {

      total:
        orders.length,

      pending:
        pendingOrders,

      confirmed:
        confirmedOrders,

      processing:
        processingOrders,

      shipped:
        shippedOrders,

      delivered:
        deliveredOrders,

      cancelled:
        cancelledOrders

    },

    sales: {

      total:
        totalSales

    }

  };

}


/* =================================================================
   26. CATEGORIES / COLLECTIONS
   ================================================================= */

function getProductMetadata() {

  const products =
    getAllProductsForAdmin();

  const categories = {};
  const collections = {};
  const badges = {};
  const subCategories = {};

  products.forEach(
    function(product) {

      const category =
        safeString(
          product.category
        );

      const subCategory =
        safeString(
          product.subCategory
        );

      const collection =
        safeString(
          product.collection
        );

      const badge =
        safeString(
          product.badge
        );

      if (category) {

        categories[category] =
          true;

      }

      if (subCategory) {

        subCategories[subCategory] =
          true;

      }

      if (collection) {

        collections[collection] =
          true;

      }

      if (badge) {

        badges[badge] =
          true;

      }

    }
  );

  return {

    categories:
      Object.keys(
        categories
      ).sort(),

    subCategories:
      Object.keys(
        subCategories
      ).sort(),

    collections:
      Object.keys(
        collections
      ).sort(),

    badges:
      Object.keys(
        badges
      ).sort()

  };

}


/* =================================================================
   PHYSICAL STORE / POS MANAGEMENT — FINAL
   ================================================================= */

const STORE_SALES_HEADERS = [
  "Date","Receipt No","Customer Name","Customer Phone","Items","Subtotal","Discount %","Discount","Total","Paid","Due","Payment Method","Transaction ID","Note","Cashier","Status"
];
const STORE_EXPENSE_HEADERS = ["Date","Expense ID","Category","Amount","Payment Method","Reference","Description","User","Status"];
const STORE_PURCHASE_HEADERS = ["Date","Purchase ID","Supplier","Supplier Phone","Product ID","Product Name","Size","Quantity","Cost Price","Total Cost","Paid","Due","Payment Method","Reference","Note","User","Status"];
const STORE_RETURN_HEADERS = ["Date","Return ID","Receipt No","Product ID","Product Name","Size","Quantity","Refund Amount","Payment Method","Reason","User","Status"];

function ensureStoreSheet_(name, headers) {
  const ss=getSpreadsheet(); let sh=ss.getSheetByName(name);
  if(!sh){sh=ss.insertSheet(name);sh.getRange(1,1,1,headers.length).setValues([headers]);sh.setFrozenRows(1);}
  return sh;
}
function getOrCreateStoreSalesSheet_(){return ensureStoreSheet_("Store Sales",STORE_SALES_HEADERS);}
function getOrCreateStoreExpensesSheet_(){return ensureStoreSheet_("Store Expenses",STORE_EXPENSE_HEADERS);}
function getOrCreateStorePurchasesSheet_(){return ensureStoreSheet_("Store Purchases",STORE_PURCHASE_HEADERS);}
function getOrCreateStoreReturnsSheet_(){return ensureStoreSheet_("Store Returns",STORE_RETURN_HEADERS);}
function storeRows_(sheet, mapper){const data=sheet.getDataRange().getValues();if(data.length<2)return[];const headers=data[0].map(normalizeHeader),out=[];for(let i=1;i<data.length;i++){if(!data[i].some(v=>v!==""&&v!==null&&v!==undefined))continue;out.push(mapper(headers,data[i],i+1));}return out.reverse();}
function storeGet_(headers,row,names){const i=getColumnIndex(headers,names);return i<0?"":row[i];}
function parseStoreItems_(value){if(Array.isArray(value))return value;if(typeof value==="string"){try{const x=JSON.parse(value);return Array.isArray(x)?x:[]}catch(e){return[]}}return[];}
function storeSaleRowToObject_(h,r,n){return{rowNumber:n,date:storeGet_(h,r,["date"]),receiptNo:safeString(storeGet_(h,r,["receiptno","receiptid"])),customerName:safeString(storeGet_(h,r,["customername","name"]))||"Walk-in Customer",customerPhone:safeString(storeGet_(h,r,["customerphone","phone"])),items:parseStoreItems_(storeGet_(h,r,["items"])),subtotal:safeNumber(storeGet_(h,r,["subtotal"])),discountPct:safeNumber(storeGet_(h,r,["discountpct","discountpercent"])),discount:safeNumber(storeGet_(h,r,["discount"])),total:safeNumber(storeGet_(h,r,["total"])),paid:safeNumber(storeGet_(h,r,["paid"])),due:safeNumber(storeGet_(h,r,["due"])),payment:safeString(storeGet_(h,r,["paymentmethod","payment"])),transactionId:safeString(storeGet_(h,r,["transactionid","transaction","reference"])),note:safeString(storeGet_(h,r,["note","salenote"])),cashier:safeString(storeGet_(h,r,["cashier","user"])),status:safeString(storeGet_(h,r,["status"]))||"Completed"};}
function getAllStoreSales_(){return storeRows_(getOrCreateStoreSalesSheet_(),storeSaleRowToObject_);}
function storeExpenseRowToObject_(h,r,n){return{rowNumber:n,date:storeGet_(h,r,["date"]),expenseId:safeString(storeGet_(h,r,["expenseid","id"])),category:safeString(storeGet_(h,r,["category"]))||"Other Expense",amount:safeNumber(storeGet_(h,r,["amount"])),payment:safeString(storeGet_(h,r,["paymentmethod","payment"])),reference:safeString(storeGet_(h,r,["reference","transactionid"])),description:safeString(storeGet_(h,r,["description","note"])),user:safeString(storeGet_(h,r,["user","cashier"])),status:safeString(storeGet_(h,r,["status"]))||"Completed"};}
function getAllStoreExpenses_(){return storeRows_(getOrCreateStoreExpensesSheet_(),storeExpenseRowToObject_);}
function storePurchaseRowToObject_(h,r,n){return{rowNumber:n,date:storeGet_(h,r,["date"]),purchaseId:safeString(storeGet_(h,r,["purchaseid","id"])),supplier:safeString(storeGet_(h,r,["supplier"])),supplierPhone:safeString(storeGet_(h,r,["supplierphone","phone"])),productId:safeString(storeGet_(h,r,["productid"])),productName:safeString(storeGet_(h,r,["productname","product"])),size:safeString(storeGet_(h,r,["size"])),quantity:safeNumber(storeGet_(h,r,["quantity","qty"])),costPrice:safeNumber(storeGet_(h,r,["costprice","cost"])),totalCost:safeNumber(storeGet_(h,r,["totalcost","total"])),paid:safeNumber(storeGet_(h,r,["paid"])),due:safeNumber(storeGet_(h,r,["due"])),payment:safeString(storeGet_(h,r,["paymentmethod","payment"])),reference:safeString(storeGet_(h,r,["reference"])),note:safeString(storeGet_(h,r,["note"])),user:safeString(storeGet_(h,r,["user","cashier"])),status:safeString(storeGet_(h,r,["status"]))||"Completed"};}
function getAllStorePurchases_(){return storeRows_(getOrCreateStorePurchasesSheet_(),storePurchaseRowToObject_);}
function storeReturnRowToObject_(h,r,n){return{rowNumber:n,date:storeGet_(h,r,["date"]),returnId:safeString(storeGet_(h,r,["returnid","id"])),receiptNo:safeString(storeGet_(h,r,["receiptno"])),productId:safeString(storeGet_(h,r,["productid"])),productName:safeString(storeGet_(h,r,["productname","product"])),size:safeString(storeGet_(h,r,["size"])),quantity:safeNumber(storeGet_(h,r,["quantity","qty"])),refundAmount:safeNumber(storeGet_(h,r,["refundamount","refund"])),payment:safeString(storeGet_(h,r,["paymentmethod","payment"])),reason:safeString(storeGet_(h,r,["reason","description"])),user:safeString(storeGet_(h,r,["user","cashier"])),status:safeString(storeGet_(h,r,["status"]))||"Completed"};}
function getAllStoreReturns_(){return storeRows_(getOrCreateStoreReturnsSheet_(),storeReturnRowToObject_);}
function generateStoreReceiptNo_(){const tz=Session.getScriptTimeZone(),date=Utilities.formatDate(new Date(),tz,"yyyyMMdd"),props=PropertiesService.getScriptProperties(),key="PEPPY_STORE_RECEIPT_SEQ_"+date,seq=safeNumber(props.getProperty(key))+1;props.setProperty(key,String(seq));return"PF-"+date+"-"+String(seq).padStart(4,"0");}
function generateStoreId_(prefix){return prefix+Utilities.formatDate(new Date(),Session.getScriptTimeZone(),"yyyyMMddHHmmss")+Math.floor(Math.random()*1000);}
function storeFinalProductPrice_(p){const original=safeNumber(p.price),disc=safeNumber(p.discount);return disc>0?Math.max(0,original-(original*disc/100)):original;}
function normalizeStoreSaleItems_(items){if(!Array.isArray(items)||!items.length)throw new Error("At least one sale item is required.");const products=getAllProductsForAdmin();return items.map(function(item){const type=safeString(item.type).toLowerCase()==="manual"?"manual":"website",qty=getOrderItemQuantity_(item),name=safeString(item.name),size=safeString(item.size),price=Math.max(0,safeNumber(item.price));if(qty<=0)throw new Error("Invalid quantity.");if(type==="manual"){if(!name)throw new Error("Manual product name is required.");return{type:"manual",id:"",name:name,size:size,quantity:qty,price:price,costPrice:0};}const id=getOrderItemProductId_(item);const p=products.find(x=>String(x.id)===String(id));if(!p)throw new Error("Product not found: "+id);const stock=safeNumber(p.stock);if(stock<qty)throw new Error("Insufficient stock for "+p.name+". Available: "+stock+", requested: "+qty);return{type:"website",id:id,name:safeString(p.name),size:size,quantity:qty,price:storeFinalProductPrice_(p),costPrice:safeNumber(p.costPrice||p.cost||0)};});}
function createStoreSale(data){requireAdmin(data);const lock=LockService.getScriptLock();lock.waitLock(15000);try{const items=normalizeStoreSaleItems_(data.items),subtotal=items.reduce((a,i)=>a+i.quantity*i.price,0),pct=Math.min(100,Math.max(0,safeNumber(data.discountPct))),discount=subtotal*pct/100,total=Math.max(0,subtotal-discount),paid=Math.max(0,safeNumber(data.paid));if(total<=0)throw new Error("Sale total must be greater than zero.");if(paid>total)throw new Error("Paid amount cannot be greater than total.");const websiteItems=items.filter(i=>i.type==="website");if(websiteItems.length)adjustProductStockForOrder_(websiteItems,"deduct");const receiptNo=generateStoreReceiptNo_(),now=new Date(),cashier=safeString(data.cashier)||"Admin",sale={date:now,receiptNo:receiptNo,customerName:safeString(data.customerName)||"Walk-in Customer",customerPhone:safeString(data.customerPhone),items:items,subtotal:subtotal,discountPct:pct,discount:discount,total:total,paid:paid,due:Math.max(0,total-paid),payment:safeString(data.payment)||"Cash",transactionId:safeString(data.transactionId),note:safeString(data.note),cashier:cashier,status:"Completed"};getOrCreateStoreSalesSheet_().appendRow([now,receiptNo,sale.customerName,sale.customerPhone,JSON.stringify(items),subtotal,pct,discount,total,paid,sale.due,sale.payment,sale.transactionId,sale.note,cashier,sale.status]);return{message:"Physical store sale saved.",sale:sale};}finally{lock.releaseLock();}}
function createStoreExpense(data){requireAdmin(data);const amount=Math.max(0,safeNumber(data.amount));if(amount<=0)throw new Error("Expense amount must be greater than zero.");const id=generateStoreId_("EXP-"),category=safeString(data.category)||"Other Expense";getOrCreateStoreExpensesSheet_().appendRow([new Date(),id,category,amount,safeString(data.payment)||"Cash",safeString(data.reference),safeString(data.description),"Admin","Completed"]);return{message:"Store expense saved.",expenseId:id};}
function createStorePurchase(data){requireAdmin(data);const productId=safeString(data.productId),qty=Math.max(1,Math.floor(safeNumber(data.quantity))),cost=Math.max(0,safeNumber(data.costPrice)),paid=Math.max(0,safeNumber(data.paid));if(!productId)throw new Error("Product is required.");if(cost<=0)throw new Error("Cost price must be greater than zero.");const products=getAllProductsForAdmin(),p=products.find(x=>String(x.id)===productId);if(!p)throw new Error("Product not found.");const total=qty*cost;if(paid>total)throw new Error("Paid cannot exceed purchase total.");const lock=LockService.getScriptLock();lock.waitLock(15000);try{adjustProductStockForOrder_([{id:productId,quantity:qty,name:p.name}],"restore");const id=generateStoreId_("PUR-"),now=new Date();getOrCreateStorePurchasesSheet_().appendRow([now,id,safeString(data.supplier),safeString(data.supplierPhone),productId,p.name,safeString(data.size),qty,cost,total,paid,total-paid,safeString(data.payment)||"Cash",safeString(data.reference),safeString(data.note),"Admin","Completed"]);return{message:"Purchase saved and stock increased.",purchaseId:id};}finally{lock.releaseLock();}}
function createStoreReturn(data){requireAdmin(data);const receiptNo=safeString(data.receiptNo),sales=getAllStoreSales_(),sale=sales.find(s=>String(s.receiptNo).toLowerCase()===receiptNo.toLowerCase());if(!sale)throw new Error("Receipt not found.");const item=data.item||{},qty=Math.max(1,Math.floor(safeNumber(data.quantity))),refund=Math.max(0,safeNumber(data.refundAmount));if(qty>safeNumber(item.quantity))throw new Error("Return quantity exceeds sold quantity.");const existing=getAllStoreReturns_().filter(r=>String(r.receiptNo).toLowerCase()===receiptNo.toLowerCase()&&String(r.productId)===String(item.id));const returned=existing.reduce((a,r)=>a+safeNumber(r.quantity),0);if(returned+qty>safeNumber(item.quantity))throw new Error("Total returned quantity cannot exceed sold quantity.");const lock=LockService.getScriptLock();lock.waitLock(15000);try{if(safeString(item.id))adjustProductStockForOrder_([{id:item.id,quantity:qty,name:item.name}],"restore");const id=generateStoreId_("RET-"),now=new Date();getOrCreateStoreReturnsSheet_().appendRow([now,id,receiptNo,item.id,safeString(item.name),safeString(item.size),qty,refund,safeString(data.payment)||"Cash",safeString(data.reason),"Admin","Completed"]);return{message:"Return saved and stock restored.",returnId:id};}finally{lock.releaseLock();}}
function htmlEscape_(v){return safeString(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
function receiptPdfHtml_(sale,logo){const items=(sale.items||[]).map(i=>`<tr><td>${htmlEscape_(i.name)}${i.size?" · "+htmlEscape_(i.size):""}</td><td>${i.quantity}</td><td>${Number(i.price||0).toFixed(2)}</td><td>${(Number(i.price||0)*Number(i.quantity||0)).toFixed(2)}</td></tr>`).join("");return`<html><head><style>@page{size:80mm auto;margin:4mm}body{font-family:Arial,sans-serif;font-size:10px;color:#111;margin:0}.wrap{width:72mm;margin:auto;text-align:left}.head{text-align:center;border-bottom:1px dashed #555;padding-bottom:8px}.head img{max-width:110px;max-height:42px}.head h2{font-size:17px;margin:3px 0}.line{display:flex;justify-content:space-between;padding:3px 0}.items{border-top:1px dashed #555;border-bottom:1px dashed #555;margin:6px 0;padding:5px 0}table{width:100%;border-collapse:collapse}td{padding:2px 0}td:nth-child(n+2){text-align:right}.total{font-weight:bold;font-size:13px}.foot{text-align:center;margin-top:8px;color:#555}</style></head><body><div class="wrap"><div class="head">${logo?`<img src="${logo}">`:""}<h2>Peppy Fashion</h2><div>Physical Store Receipt</div><div>${htmlEscape_(sale.receiptNo)}</div><div>${htmlEscape_(sale.date)}</div></div><div class="line"><span>Customer</span><b>${htmlEscape_(sale.customerName)}</b></div>${sale.customerPhone?`<div class="line"><span>Phone</span><b>${htmlEscape_(sale.customerPhone)}</b></div>`:""}<div class="items"><table><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>${items}</table></div><div class="line"><span>Subtotal</span><b>৳${Number(sale.subtotal||0).toFixed(2)}</b></div><div class="line"><span>Discount (${Number(sale.discountPct||0).toFixed(2)}%)</span><b>৳${Number(sale.discount||0).toFixed(2)}</b></div><div class="line total"><span>Total</span><b>৳${Number(sale.total||0).toFixed(2)}</b></div><div class="line"><span>Paid</span><b>৳${Number(sale.paid||0).toFixed(2)}</b></div><div class="line"><span>Due</span><b>৳${Number(sale.due||0).toFixed(2)}</b></div><div class="line"><span>Payment</span><b>${htmlEscape_(sale.payment)}</b></div>${sale.transactionId?`<div class="line"><span>Reference</span><b>${htmlEscape_(sale.transactionId)}</b></div>`:""}<div class="foot">Thank you for shopping with Peppy Fashion.</div></div></body></html>`;}
function pdfBase64FromHtml_(html){const blob=Utilities.newBlob(html,"text/html","peppy.html").getAs(MimeType.PDF);return Utilities.base64Encode(blob.getBytes());}
function createStoreReceiptPdf(data){requireAdmin(data);const sale=data.sale;if(!sale)throw new Error("Sale data is required.");return{filename:safeString(sale.receiptNo)||"receipt",pdfBase64:pdfBase64FromHtml_(receiptPdfHtml_(sale,safeString(data.logoDataUrl)))}} 
function createStoreReportPdf(data){requireAdmin(data);const r=data.report||{},sales=r.sales||[],expenses=r.expenses||[],best={};sales.forEach(s=>(s.items||[]).forEach(i=>best[i.name]=(best[i.name]||0)+safeNumber(i.quantity)));const expenseRows=expenses.map(e=>`<tr><td>${htmlEscape_(e.category)}</td><td>৳${safeNumber(e.amount).toFixed(2)}</td></tr>`).join(""),bestRows=Object.entries(best).sort((a,b)=>b[1]-a[1]).slice(0,15).map(x=>`<tr><td>${htmlEscape_(x[0])}</td><td>${x[1]}</td></tr>`).join("");const html=`<html><head><style>@page{size:A4;margin:16mm}body{font-family:Arial,sans-serif;color:#111;font-size:11px}h1{margin:0 0 4px}h2{margin-top:22px}p{color:#555}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.card{border:1px solid #ddd;padding:9px}.card b{display:block;font-size:15px;margin-top:3px}table{width:100%;border-collapse:collapse}th,td{border-bottom:1px solid #ddd;padding:6px;text-align:left}</style></head><body><h1>Peppy Fashion — Store Report</h1><p>${htmlEscape_(safeString(r.from))} to ${htmlEscape_(safeString(r.to))}</p><div class="cards"><div class="card">Sales<b>৳${safeNumber(r.salesTotal).toFixed(2)}</b></div><div class="card">Transactions<b>${sales.length}</b></div><div class="card">Expenses<b>৳${safeNumber(r.expTotal).toFixed(2)}</b></div><div class="card">Net<b>৳${(safeNumber(r.salesTotal)-safeNumber(r.expTotal)).toFixed(2)}</b></div></div><h2>Best Selling Products</h2><table><tr><th>Product</th><th>Qty Sold</th></tr>${bestRows||'<tr><td colspan="2">No sales</td></tr>'}</table><h2>Expense Breakdown</h2><table><tr><th>Category</th><th>Amount</th></tr>${expenseRows||'<tr><td colspan="2">No expenses</td></tr>'}</table><h2>Profit & Loss</h2><p>Revenue: ৳${safeNumber(r.salesTotal).toFixed(2)}<br>COGS: ৳${safeNumber(r.cogs).toFixed(2)}<br>Gross Profit: ৳${safeNumber(r.gross).toFixed(2)}<br>Operating Expenses: ৳${safeNumber(r.expTotal).toFixed(2)}<br><b>Net Profit: ৳${safeNumber(r.net).toFixed(2)}</b></p></body></html>`;return{filename:"store-report",pdfBase64:pdfBase64FromHtml_(html)};}

/* =================================================================
   27. EXISTING WEBSITE GET API
   ================================================================= */

function doGet(e) {

  try {

    const params =
      e &&
      e.parameter
        ? e.parameter
        : {};

    const action =
      safeString(
        params.action
      ).toLowerCase();

    if (
      !action ||
      action === "products" ||
      action === "publicproducts"
    ) {

      return createJsonResponse(
        getPublicProducts()
      );

    }

    if (
      action === "adminproducts" ||
      action === "allproducts"
    ) {

      requireAdmin(
        params
      );

      return successResponse({

        products:
          getAllProductsForAdmin()

      });

    }

    if (
      action === "dashboard"
    ) {

      requireAdmin(
        params
      );

      return successResponse({

        dashboard:
          getDashboardStats()

      });

    }

    if (
      action === "orders"
    ) {

      requireAdmin(
        params
      );

      return successResponse({

        orders:
          getAllOrders()

      });

    }

    if (action === "storesales") {
      requireAdmin(params);
      return successResponse({ sales: getAllStoreSales_() });
    }

    if (action === "storeexpenses") { requireAdmin(params); return successResponse({ expenses: getAllStoreExpenses_() }); }
    if (action === "storepurchases") { requireAdmin(params); return successResponse({ purchases: getAllStorePurchases_() }); }
    if (action === "storereturns") { requireAdmin(params); return successResponse({ returns: getAllStoreReturns_() }); }

    if (
      action === "metadata"
    ) {

      requireAdmin(
        params
      );

      return successResponse({

        metadata:
          getProductMetadata()

      });

    }

    if (
      action === "product"
    ) {

      requireAdmin(
        params
      );

      const id =
        params.id;

      const products =
        getAllProductsForAdmin();

      const product =
        products.find(
          function(item) {

            return String(item.id) ===
              String(id);

          }
        );

      if (!product) {

        return errorResponse(
          "Product not found."
        );

      }

      return successResponse({

        product:
          product

      });

    }

    if (
      action === "clearcache"
    ) {

      requireAdmin(
        params
      );

      clearProductCache();

      return successResponse({

        message:
          "Product cache cleared."

      });

    }

    return errorResponse(
      "Unknown action: " +
      action
    );

  }

  catch (err) {

    return errorResponse(
      err.toString()
    );

  }

}


/* =================================================================
   28. EXISTING CHECKOUT / ORDER POST API
   ================================================================= */

function doPost(e) {

  try {

    if (
      !e ||
      !e.postData ||
      !e.postData.contents
    ) {

      throw new Error(
        "No POST data received."
      );

    }

    // The website sends checkout orders as a simple form POST:
    // payload=<JSON string>. Admin actions may still send raw JSON.
    let raw = e.postData.contents;
    let data;

    try {
      data = JSON.parse(raw);
    } catch (jsonError) {
      if (e.parameter && e.parameter.payload) {
        try {
          data = JSON.parse(e.parameter.payload);
        } catch (payloadError) {
          throw new Error("Invalid order payload: " + payloadError.message);
        }
      } else {
        // Fallback for URL-encoded bodies where Apps Script did not expose
        // the parameter in e.parameter.
        const match = raw.match(/(?:^|&)payload=([^&]*)/);
        if (!match) throw new Error("Invalid POST data received.");
        try {
          data = JSON.parse(decodeURIComponent(match[1].replace(/\+/g, " ")));
        } catch (payloadError2) {
          throw new Error("Invalid order payload: " + payloadError2.message);
        }
      }
    }

    if (!data || typeof data !== "object") {
      throw new Error("Invalid POST data received.");
    }

    const action =
      safeString(
        data.action
      ).toLowerCase();


    /* -------------------------------------------------------------
       ADMIN PRODUCT
       ------------------------------------------------------------- */

    if (
      action === "addproduct"
    ) {

      return successResponse(
        addProduct(
          data
        )
      );

    }


    if (
      action === "updateproduct"
    ) {

      return successResponse(
        updateProduct(
          data
        )
      );

    }


    if (
      action === "deleteproduct"
    ) {

      return successResponse(
        deleteProduct(
          data
        )
      );

    }


    if (
      action === "restoreproduct"
    ) {

      return successResponse(
        restoreProduct(
          data
        )
      );

    }


    /*
     * NEW:
     * Permanent product deletion.
     *
     * Frontend sends:
     *
     * {
     *   action: "permanentDeleteProduct",
     *   id: "...",
     *   adminToken: "..."
     * }
     */
    if (
      action === "permanentdeleteproduct"
    ) {

      return successResponse(
        permanentDeleteProduct(
          data
        )
      );

    }


    if (
      action === "updateproductstatus"
    ) {

      return successResponse(
        updateProductStatus(
          data
        )
      );

    }


    if (
      action === "updatestock"
    ) {

      return successResponse(
        updateProductStock(
          data
        )
      );

    }


    if (
      action === "updatefeatured"
    ) {

      return successResponse(
        updateProductFeatured(
          data
        )
      );

    }


    /* -------------------------------------------------------------
       ADMIN IMAGE MANAGEMENT
       ------------------------------------------------------------- */

    if (
      action === "uploadimage"
    ) {

      return successResponse(
        uploadImageToGitHub_(
          data
        )
      );

    }


    if (
      action === "updateproductimages"
    ) {

      return successResponse(
        updateProductImages_(
          data
        )
      );

    }


    if (
      action === "deleteimage"
    ) {

      return successResponse(
        deleteImageFromGitHub_(
          data
        )
      );

    }


    /* -------------------------------------------------------------
       PHYSICAL STORE / POS
       ------------------------------------------------------------- */

    if (action === "createstoresale") {
      return successResponse(createStoreSale(data));
    }

    if (action === "createstoreexpense") { return successResponse(createStoreExpense(data)); }
    if (action === "createstorepurchase") { return successResponse(createStorePurchase(data)); }
    if (action === "createstorereturn") { return successResponse(createStoreReturn(data)); }
    if (action === "createstoreReceiptPdf".toLowerCase()) { return successResponse(createStoreReceiptPdf(data)); }
    if (action === "createstoreReportPdf".toLowerCase()) { return successResponse(createStoreReportPdf(data)); }

    if (action === "getmarketingcampaigns") { return successResponse(getMarketingCampaigns(data)); }
    if (action === "createmarketingcampaign") { return successResponse(createMarketingCampaign(data)); }
    if (action === "sendmarketingcampaign") { return successResponse(sendMarketingCampaign(data)); }
    if (action === "setupmarketingautomation") { requireAdmin(data); return successResponse({message:setupMarketingAutomation()}); }

    /* -------------------------------------------------------------
       ADMIN ORDER
       ------------------------------------------------------------- */

    if (
      action === "updateorderstatus"
    ) {

      return successResponse(
        updateOrderStatus(
          data
        )
      );

    }


    /* -------------------------------------------------------------
       EXISTING WEBSITE ORDER
       ------------------------------------------------------------- */

    return processCustomerOrder(
      data
    );

  }

  catch (err) {

    return errorResponse(
      err.toString()
    );

  }

}


/* =================================================================
   STOCK CONTROL FOR CUSTOMER ORDERS
   ================================================================= */

function parseOrderItems_(data) {
  let items = data.items;
  if (typeof items === "string") {
    try { items = JSON.parse(items); }
    catch (error) { throw new Error("Invalid order items data."); }
  }
  if (!Array.isArray(items) || !items.length) {
    throw new Error("No products found in order.");
  }
  return items;
}

function getOrderItemProductId_(item) {
  return safeString(
    item.id !== undefined ? item.id :
    (item.productId !== undefined ? item.productId : item.productID)
  );
}

function getOrderItemQuantity_(item) {
  const quantity = Number(
    item.quantity !== undefined ? item.quantity :
    (item.qty !== undefined ? item.qty : 1)
  );
  if (!isFinite(quantity) || quantity <= 0) {
    throw new Error("Invalid quantity for product: " + safeString(item.name));
  }
  return Math.floor(quantity);
}

function getOrderStockKey_(orderId) {
  return "PEPPY_STOCK_DEDUCTED_" + safeString(orderId);
}

function getOrderItemsKey_(orderId) {
  return "PEPPY_ORDER_ITEMS_" + safeString(orderId);
}

function isStockAlreadyDeducted_(orderId) {
  return Boolean(
    PropertiesService.getScriptProperties().getProperty(getOrderStockKey_(orderId))
  );
}

function adjustProductStockForOrder_(items, direction) {
  const sheet = getSheet("Products");
  if (!sheet) throw new Error("Products sheet not found.");
  const col = getProductColumns(sheet);
  if (col.id < 0) throw new Error("ID column not found in Products sheet.");
  if (col.stock < 0) throw new Error("Stock column not found in Products sheet.");

  const quantities = {};
  items.forEach(function(item) {
    const productId = getOrderItemProductId_(item);
    if (!productId) throw new Error("Product ID is missing for: " + safeString(item.name));
    const quantity = getOrderItemQuantity_(item);
    quantities[productId] = (quantities[productId] || 0) + quantity;
  });

  const rows = {};
  Object.keys(quantities).forEach(function(productId) {
    const rowNumber = findProductRow(productId);
    if (rowNumber === -1) throw new Error("Product not found: " + productId);
    const currentStock = safeNumber(sheet.getRange(rowNumber, col.stock + 1).getValue());
    if (direction === "deduct" && currentStock < quantities[productId]) {
      throw new Error("Insufficient stock for product ID " + productId + ". Available: " + currentStock + ", requested: " + quantities[productId]);
    }
    rows[productId] = { rowNumber: rowNumber, stock: currentStock };
  });

  Object.keys(quantities).forEach(function(productId) {
    const info = rows[productId];
    const quantity = quantities[productId];
    const newStock = direction === "restore"
      ? info.stock + quantity
      : Math.max(0, info.stock - quantity);
    sheet.getRange(info.rowNumber, col.stock + 1).setValue(newStock);
  });
  clearProductCache();
}

function deductStockForOrder_(orderId, items) {
  if (isStockAlreadyDeducted_(orderId)) return;
  adjustProductStockForOrder_(items, "deduct");
  const props = PropertiesService.getScriptProperties();
  props.setProperty(getOrderStockKey_(orderId), "1");
  props.setProperty(getOrderItemsKey_(orderId), JSON.stringify(items));
}

function restoreStockForCancelledOrder_(orderId) {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty(getOrderStockKey_(orderId))) return;
  const storedItems = props.getProperty(getOrderItemsKey_(orderId));
  if (!storedItems) return;
  let items;
  try { items = JSON.parse(storedItems); }
  catch (error) { throw new Error("Unable to restore stock: invalid stored order items."); }
  if (!Array.isArray(items)) throw new Error("Unable to restore stock: invalid stored order items.");
  adjustProductStockForOrder_(items, "restore");
  props.deleteProperty(getOrderStockKey_(orderId));
}


/* =================================================================
   PEPPY FASHION — MARKETING AUTOMATION
   ================================================================= */
const MARKETING_CAMPAIGN_HEADERS = ["Campaign ID","Name","Type","Subject","Preheader","Body HTML","Audience","Discount Code","Start Date","End Date","Status","Created At","Last Run","Sent","Failed"];
const MARKETING_LOG_HEADERS = ["Timestamp","Campaign ID","Email","Customer Name","Status","Error"];

function getOrCreateMarketingSheet_(name, headers){
  const ss=getSpreadsheet(); let sh=ss.getSheetByName(name);
  if(!sh){sh=ss.insertSheet(name);sh.getRange(1,1,1,headers.length).setValues([headers]);}
  return sh;
}
function marketingSheetObjects_(name,headers){
  const sh=getOrCreateMarketingSheet_(name,headers), values=sh.getDataRange().getValues();
  if(values.length<2)return [];
  const h=values[0].map(v=>String(v).trim().toLowerCase());
  return values.slice(1).map((r,i)=>{const o={rowNumber:i+2};headers.forEach(k=>{const idx=h.indexOf(k.toLowerCase());o[k]=idx>=0?r[idx]:"";});return o;});
}
function getMarketingCampaigns(data){requireAdmin(data);return {campaigns:marketingSheetObjects_("MarketingCampaigns",MARKETING_CAMPAIGN_HEADERS).map(marketingCampaignPublic_)};}
function marketingCampaignPublic_(c){return {campaignId:String(c["Campaign ID"]||""),name:String(c.Name||""),type:String(c.Type||"Campaign"),subject:String(c.Subject||""),preheader:String(c.Preheader||""),bodyHtml:String(c["Body HTML"]||""),audience:String(c.Audience||"All Customers"),discountCode:String(c["Discount Code"]||""),startDate:c["Start Date"]||"",endDate:c["End Date"]||"",status:String(c.Status||"Draft"),createdAt:c["Created At"]||"",lastRun:c["Last Run"]||"",sent:Number(c.Sent||0),failed:Number(c.Failed||0)};}
function createMarketingCampaign(data){
  requireAdmin(data); const sh=getOrCreateMarketingSheet_("MarketingCampaigns",MARKETING_CAMPAIGN_HEADERS), id="CMP"+Utilities.formatDate(new Date(),Session.getScriptTimeZone(),"yyMMddHHmmss")+Math.floor(Math.random()*1000);
  const now=new Date(); sh.appendRow([id,safeString(data.name)||"Untitled Campaign",safeString(data.type)||"Campaign",safeString(data.subject)||"Peppy Fashion",safeString(data.preheader),safeString(data.bodyHtml),safeString(data.audience)||"All Customers",safeString(data.discountCode),safeString(data.startDate),safeString(data.endDate),safeString(data.status)||"Scheduled",now,"",0,0]);
  return {message:"Campaign created.",campaignId:id};
}
function getMarketingCustomers_(audience){
  const orders=getAllOrders(), map=new Map(), now=new Date();
  orders.forEach(o=>{const email=safeString(o.email).trim().toLowerCase();if(!email||email.indexOf("@")<1)return;const key=email; if(!map.has(key))map.set(key,{name:safeString(o.name)||"Customer",email:email,phone:safeString(o.phone),orders:0,total:0,last:o.date||""});const c=map.get(key);c.orders++;c.total+=safeNumber(o.total);if(new Date(o.date||0)>new Date(c.last||0))c.last=o.date;});
  const all=Array.from(map.values()); const a=String(audience||"All Customers").toLowerCase();
  return all.filter(c=>{if(a==="all customers")return true;if(a==="new customers")return c.orders===1;if(a==="vip customers")return c.total>=5000||c.orders>=5;if(a.includes("60 days"))return c.last&&((now-new Date(c.last))/86400000)>=60;if(a.includes("90 days"))return c.last&&((now-new Date(c.last))/86400000)>=90;if(a.includes("previous eid buyers"))return false;if(a.includes("previous boishakh buyers"))return false;return true;});
}
function marketingPersonalize_(html,campaign,c){return String(html||"").replace(/\{\{name\}\}/gi,htmlEscape_(c.name)).replace(/\{\{email\}\}/gi,htmlEscape_(c.email)).replace(/\{\{coupon\}\}/gi,htmlEscape_(campaign.discountCode||"")).replace(/\{\{campaign\}\}/gi,htmlEscape_(campaign.name||"Peppy Fashion"));}
function sendMarketingCampaign(data){
  requireAdmin(data); const campaigns=marketingSheetObjects_("MarketingCampaigns",MARKETING_CAMPAIGN_HEADERS), c=campaigns.find(x=>String(x["Campaign ID"])===String(data.campaignId)); if(!c)throw new Error("Campaign not found.");
  const campaign=marketingCampaignPublic_(c), recipients=getMarketingCustomers_(campaign.audience), log=getOrCreateMarketingSheet_("MarketingEmailLog",MARKETING_LOG_HEADERS), subject=campaign.subject||campaign.name||"Peppy Fashion Update"; let sent=0,failed=0;
  recipients.forEach(customer=>{try{MailApp.sendEmail({to:customer.email,subject:subject,htmlBody:marketingPersonalize_(campaign.bodyHtml,campaign,customer)});log.appendRow([new Date(),campaign.campaignId,customer.email,customer.name,"Sent",""]);sent++;}catch(e){log.appendRow([new Date(),campaign.campaignId,customer.email,customer.name,"Failed",e.message]);failed++;}});
  const row=c.rowNumber; const vals=campaigns.map(x=>x); const sh=getOrCreateMarketingSheet_("MarketingCampaigns",MARKETING_CAMPAIGN_HEADERS); sh.getRange(row,11,1,5).setValues([["Sent",new Date(),new Date(),sent,failed]]);
  return {message:"Campaign sent.",sent,failed,total:recipients.length};
}
function runScheduledMarketingCampaigns(){
  const campaigns=marketingSheetObjects_("MarketingCampaigns",MARKETING_CAMPAIGN_HEADERS), today=new Date(); campaigns.forEach(c=>{const status=String(c.Status||"").toLowerCase();if(status!=="scheduled")return;const start=c["Start Date"]?new Date(c["Start Date"]):today,end=c["End Date"]?new Date(c["End Date"]):null;if(start>today||(end&&today>end))return;try{sendMarketingCampaign({adminToken:getAdminToken(),campaignId:c["Campaign ID"]});}catch(e){console.error(e);}});
}
function setupMarketingAutomation(){
  const triggers=ScriptApp.getProjectTriggers(); triggers.forEach(t=>{if(t.getHandlerFunction()==="runScheduledMarketingCampaigns")ScriptApp.deleteTrigger(t);});
  ScriptApp.newTrigger("runScheduledMarketingCampaigns").timeBased().everyHours(1).create();
  getOrCreateMarketingSheet_("MarketingCampaigns",MARKETING_CAMPAIGN_HEADERS);getOrCreateMarketingSheet_("MarketingEmailLog",MARKETING_LOG_HEADERS);
  return "Marketing automation trigger installed.";
}

/* =================================================================
   29. PROCESS CUSTOMER ORDER
   ================================================================= */

function processCustomerOrder(
  data
) {

  const orderLock = LockService.getScriptLock();
  orderLock.waitLock(15000);

  try {

  const ss =
    getSpreadsheet();

  let ordersSheet =
    ss.getSheetByName(
      "Orders"
    );

  if (!ordersSheet) {

    ordersSheet =
      ss.insertSheet(
        "Orders"
      );

    ordersSheet
      .getRange(
        1,
        1,
        1,
        ORDER_HEADERS.length
      )
      .setValues([
        ORDER_HEADERS
      ]);

  }

  const orderId =
    data.orderId ||
    (
      "PF" +
      Utilities.formatDate(

        new Date(),

        Session.getScriptTimeZone(),

        "yyMMddHHmmss"

      )
    );

  let totalQty = 0;

  let itemsText = "";

  const items = parseOrderItems_(data);

  items.forEach(function(item) {
    const quantity = getOrderItemQuantity_(item);
    totalQty += quantity;
    itemsText += `${safeString(item.name)} (${safeString(item.size) || "N/A"}) x${quantity}; `;
  });

  /* Validate stock and deduct it before accepting the order. */
  deductStockForOrder_(orderId, items);


  ordersSheet.appendRow([

    new Date(),

    orderId,

    data.name || "",

    "'" +
      (
        data.phone || ""
      ),

    data.email || "",

    data.address || "",

    itemsText,

    totalQty || 1,

    safeNumber(
      data.subtotal
    ),

    safeNumber(
      data.discount
    ),

    safeNumber(
      data.delivery
    ),

    safeNumber(
      data.total
    ),

    data.payment ||
      "Cash on Delivery",

    data.transactionId ||
      "na",

    data.note || "",

    "Pending"

  ]);

  let customerEmailSent = false;
  let adminEmailSent = false;
  const emailErrors = [];

  if (data.email && String(data.email).includes("@")) {
    try {
      sendCustomerEmail(data, itemsText, orderId);
      customerEmailSent = true;
    } catch (emailError) {
      emailErrors.push("Customer email: " + emailError.message);
      console.error(emailError);
    }
  }

  try {
    sendAdminEmail(data, itemsText, orderId);
    adminEmailSent = true;
  } catch (emailError) {
    emailErrors.push("Admin email: " + emailError.message);
    console.error(emailError);
  }

  return createJsonResponse({
    success: true,
    message: "Order placed successfully!",
    orderId: orderId,
    customerEmailSent: customerEmailSent,
    adminEmailSent: adminEmailSent,
    emailErrors: emailErrors
  });

  }
  finally {
    orderLock.releaseLock();
  }

}


/* =================================================================
   30. CUSTOMER EMAIL
   ================================================================= */

function sendCustomerEmail(
  data,
  itemsText,
  orderId
) {

  const subject =
    `✅ Order Confirmation | Peppy Fashion | ${orderId}`;

  const htmlBody = `

  <div style="
    font-family:Arial,sans-serif;
    background:#f4f4f4;
    padding:30px;
  ">

    <div style="
      max-width:700px;
      margin:auto;
      background:#ffffff;
      border-radius:10px;
      overflow:hidden;
    ">

      <div style="
        background:#6C3BD0;
        padding:30px;
        text-align:center;
      ">

        <img
          src="${STORE_WEBSITE}assets/images/logo/logo.png"
          style="max-width:180px;"
        >

        <br><br>

        <h1 style="
          color:white;
          margin:0;
        ">
          Order Confirmed ✅
        </h1>

      </div>

      <div style="padding:35px;">

        <h2>
          Hello ${escapeHtml(data.name || "Customer")},
        </h2>

        <p>
          Thank you for shopping with
          <strong>Peppy Fashion</strong>.
          <br><br>
          We have successfully received your order.
        </p>

        <hr>

        <h3>
          Order Information
        </h3>

        <table style="
          width:100%;
          line-height:30px;
        ">

          <tr>
            <td>
              <strong>Order ID</strong>
            </td>
            <td>
              ${escapeHtml(orderId)}
            </td>
          </tr>

          <tr>
            <td>
              <strong>Phone</strong>
            </td>
            <td>
              ${escapeHtml(data.phone || "")}
            </td>
          </tr>

          <tr>
            <td>
              <strong>Payment Method</strong>
            </td>
            <td>
              ${escapeHtml(
                data.payment ||
                "Cash on Delivery"
              )}
            </td>
          </tr>

          <tr>
            <td>
              <strong>Total Amount</strong>
            </td>
            <td>
              <strong>
                ৳${safeNumber(data.total)}
              </strong>
            </td>
          </tr>

        </table>

        <hr>

        <h3>
          Products
        </h3>

        <div style="
          background:#fafafa;
          border:1px solid #ddd;
          padding:15px;
          border-radius:6px;
          white-space:pre-line;
        ">

          ${escapeHtml(itemsText)}

        </div>

        <hr>

        <h3>
          Delivery Address
        </h3>

        <p>
          ${escapeHtml(data.address || "")}
        </p>

        <hr>

        <h3>
          Need Help?
        </h3>

        <p>

          📱 WhatsApp:
          ${STORE_WHATSAPP}

          <br>

          📧 Email:
          ${STORE_EMAIL}

          <br>

          🌐 Website:
          ${STORE_WEBSITE}

          <br>

          📘 Facebook:
          ${STORE_FACEBOOK}

        </p>

        <hr>

        <p style="
          text-align:center;
          font-size:18px;
        ">

          ❤️ Thank you for choosing
          <strong>
            Peppy Fashion
          </strong>

        </p>

      </div>

    </div>

  </div>

  `;

  MailApp.sendEmail({

    to:
      data.email,

    subject:
      subject,

    htmlBody:
      htmlBody

  });

}


/* =================================================================
   31. ADMIN EMAIL
   ================================================================= */

function sendAdminEmail(
  data,
  itemsText,
  orderId
) {

  const subject =
    `🛍️ New Order Received | ${orderId}`;

  const htmlBody = `

  <div style="
    font-family:Arial,sans-serif;
    background:#f4f4f4;
    padding:30px;
  ">

    <div style="
      max-width:700px;
      margin:auto;
      background:#ffffff;
      border-radius:10px;
      overflow:hidden;
    ">

      <div style="
        background:#6C3BD0;
        padding:30px;
        text-align:center;
      ">

        <img
          src="${STORE_WEBSITE}assets/images/logo/logo.png"
          style="max-width:180px;"
        >

        <br><br>

        <h1 style="
          color:white;
          margin:0;
        ">
          🛍️ New Order Received
        </h1>

      </div>

      <div style="padding:35px;">

        <h2>
          Customer Information
        </h2>

        <table style="
          width:100%;
          line-height:30px;
        ">

          <tr>
            <td>
              <strong>Order ID</strong>
            </td>
            <td>
              ${escapeHtml(orderId)}
            </td>
          </tr>

          <tr>
            <td>
              <strong>Name</strong>
            </td>
            <td>
              ${escapeHtml(data.name || "")}
            </td>
          </tr>

          <tr>
            <td>
              <strong>Phone</strong>
            </td>
            <td>
              ${escapeHtml(data.phone || "")}
            </td>
          </tr>

          <tr>
            <td>
              <strong>Email</strong>
            </td>
            <td>
              ${escapeHtml(
                data.email ||
                "Not Provided"
              )}
            </td>
          </tr>

          <tr>
            <td>
              <strong>Address</strong>
            </td>
            <td>
              ${escapeHtml(data.address || "")}
            </td>
          </tr>

        </table>

        <hr>

        <h3>
          Ordered Products
        </h3>

        <div style="
          background:#fafafa;
          border:1px solid #ddd;
          padding:15px;
          border-radius:6px;
          white-space:pre-line;
        ">

          ${escapeHtml(itemsText)}

        </div>

        <hr>

        <h3>
          Payment Summary
        </h3>

        <table style="
          width:100%;
          line-height:30px;
        ">

          <tr>
            <td>
              <strong>Subtotal</strong>
            </td>
            <td>
              ৳${safeNumber(data.subtotal)}
            </td>
          </tr>

          <tr>
            <td>
              <strong>Discount</strong>
            </td>
            <td>
              ৳${safeNumber(data.discount)}
            </td>
          </tr>

          <tr>
            <td>
              <strong>Delivery Charge</strong>
            </td>
            <td>
              ৳${safeNumber(data.delivery)}
            </td>
          </tr>

          <tr>
            <td>
              <strong>Grand Total</strong>
            </td>
            <td>
              <strong>
                ৳${safeNumber(data.total)}
              </strong>
            </td>
          </tr>

          <tr>
            <td>
              <strong>Payment Method</strong>
            </td>
            <td>
              ${escapeHtml(
                data.payment ||
                "Cash on Delivery"
              )}
            </td>
          </tr>

          <tr>
            <td>
              <strong>Order Note</strong>
            </td>
            <td>
              ${escapeHtml(
                data.note ||
                "N/A"
              )}
            </td>
          </tr>

        </table>

        <hr>

        <p style="
          font-size:16px;
          color:#d32f2f;
        ">

          Please contact the customer
          to confirm the order.

        </p>

      </div>

    </div>

  </div>

  `;

  MailApp.sendEmail({

    to:
      ADMIN_EMAIL,

    subject:
      subject,

    htmlBody:
      htmlBody

  });

}


/* =================================================================
   32. HTML ESCAPE
   ================================================================= */

function escapeHtml(
  value
) {

  return safeString(
    value
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}



/* =================================================================
   33. TEST GITHUB CONNECTION
   ================================================================= */

/*
 * Run this function manually ONCE after deploying the new backend.
 *
 * It verifies:
 * - UrlFetchApp authorization
 * - GITHUB_TOKEN exists
 * - GitHub repository access
 * - repository owner/name
 * - branch
 *
 * It never prints the actual GitHub token.
 */
function testGitHubConnection() {

  const props =
    PropertiesService
      .getScriptProperties();

  const token =
    safeString(
      props.getProperty(
        "GITHUB_TOKEN"
      )
    );

  const owner =
    safeString(
      props.getProperty(
        "GITHUB_OWNER"
      )
    ) ||
    "peppyfashion775";

  const repo =
    safeString(
      props.getProperty(
        "GITHUB_REPO"
      )
    ) ||
    "peppy-fashion-v2";

  const branch =
    safeString(
      props.getProperty(
        "GITHUB_BRANCH"
      )
    ) ||
    "main";

  if (!token) {
    throw new Error(
      "GITHUB_TOKEN is missing."
    );
  }

  const url =
    "https://api.github.com/repos/" +
    encodeURIComponent(owner) +
    "/" +
    encodeURIComponent(repo);

  const response =
    UrlFetchApp.fetch(
      url,
      {
        method:
          "get",

        headers: {
          Authorization:
            "Bearer " + token,

          Accept:
            "application/vnd.github+json",

          "X-GitHub-Api-Version":
            "2022-11-28"
        },

        muteHttpExceptions:
          true
      }
    );

  const code =
    response.getResponseCode();

  Logger.log(
    "GitHub HTTP status: " +
    code
  );

  Logger.log(
    "GitHub repository: " +
    owner +
    "/" +
    repo
  );

  Logger.log(
    "GitHub branch: " +
    branch
  );

  if (
    code < 200 ||
    code >= 300
  ) {

    throw new Error(
      "GitHub connection failed (" +
      code +
      "): " +
      response.getContentText()
    );

  }

  Logger.log(
    "GitHub connection successful."
  );

  return {
    success:
      true,

    owner:
      owner,

    repo:
      repo,

    branch:
      branch,

    status:
      code
  };

}


/* =================================================================
   34. TEST PRODUCT API
   ================================================================= */

function testProductAPI() {

  const result =
    getPublicProducts();

  Logger.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

}


/* =================================================================
   35. TEST ADMIN API
   ================================================================= */

function testAdminAPI() {

  const token =
    getAdminToken();

  const dashboard =
    getDashboardStats();

  Logger.log(
    JSON.stringify(
      dashboard,
      null,
      2
    )
  );

  Logger.log(
    "Admin token configured: " +
    (
      token !==
      DEFAULT_ADMIN_TOKEN
    )
  );

}


/* =================================================================
   36. TEST EMAIL
   ================================================================= */

function testEmail() {

  MailApp.sendEmail(

    ADMIN_EMAIL,

    "Peppy Fashion Test",

    "Congratulations! Your Apps Script can send emails successfully."

  );

}


/* =================================================================
   END OF CODE.GS
   ================================================================= */