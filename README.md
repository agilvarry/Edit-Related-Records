# Edit-Related-Records

This widget allows users to select a record from a layer/table and edit it and other records in related tables using the [developer edition of ArcGIS Experience builder](https://developers.arcgis.com/experience-builder/) version 1.11. Later versions may also work. It requires at least one other widget to be used to select individual records from the parent/spatial table, likely the Table widget or Map widget. 

## Install

To use this widget you can download this repository and include it in the your copy of Experience builder by [following the steps in the documentation.](https://developers.arcgis.com/experience-builder/guide/getting-started-widget/#widget-location) The folder structure below is consistent with the default in Experience builder version 1.11:

```
-ArcGISExperienceBuilder/
    -server/
    -client/
        - your-extensions/
            - manifest.json
            - themes/
            - widgets/
                - Edit-Related-Records/
```

- Follow the steps from the [Installation Guide](https://developers.arcgis.com/experience-builder/guide/install-guide/) to start building.

## Widget Setup:

1. Select the parent data table and any related data tables using the Select data tool.
2. (optional) Set a display label for each table.
3. Set the Parent Data Source and it's join field. 
4. Set the Join field in the related tables.
5. Choose which fields will display in the editing form within the widget.
6. Set a header field for the list of records the widget displays prior to the editing form.
7. (optional) Set a subheader for the list of records.  
8. For non-spatial tables, set whether to enable creating/deleting records.
9. In the widget(s) where you plan to select the parent data go into the Action tab in the settings and add a Record selection changes trigger. Then under Widgets select Edit Related Records -> Listen for Selection. Without this set the widget will not be able to see when a record has been selected.

Once these steps have been completed the Edit Related Records widget should populate a list of all related records for each table you included when you select a record/feature in another widget. From there you can Add/Update/Delete as you please.

## Potential Issues

Because of how Experience buidler aggregates queries, using Filter Data triggers will likely cause confusing issues with this widget if you're using more than one other widget to select records.