import React from 'react';
import { FabricJSCanvas } from 'fabricjs-react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Paper,
    Slider,
    Tab,
    Tabs,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@material-ui/core';
import { ChromePicker } from 'react-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRight,
    faCircle,
    faCog,
    faFont,
    faMousePointer,
    faPen,
    faSquare,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';

import {
    PageContainer,
    ButtonsContainer,
    ButtonGroupStyled,
    DialogTabs,
    BrushPreview,
} from './canvas.styled';
import useCanvas from '../../../data/hooks/pages/useCanvas.page';
import { FabricDrawingToolId } from '../../../data/3rdPlugins/fabric/fabricDrawingClass';

export default function Canvas() {
    const {
        startDrawTool,
        startArrowTool,
        startRectangleTool,
        startCircleTool,
        startSelectTool,
        startTextTool,
        clearAll,
        selectTool,
        selectedTool,
        onReady,
        strokeWidth,
        updateStrokeWidth,
        updateColor,
        color,
        backgroundColor,
        updateBackgroundColor,
        isDialogOpen,
        setDialogOpen,
        currentDialogTab,
        setCurrentDialogTab,
    } = useCanvas();

    const [contextMenu, setContextMenu] = React.useState(null);

    const handleContextMenu = (event) => {
        event.preventDefault();
        if (!isDialogOpen) {
            setContextMenu(
                contextMenu === null
                    ? {
                          mouseX: event.clientX - 2,
                          mouseY: event.clientY - 4,
                      }
                    : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                      // Other native context menus might behave different.
                      // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                      null
            );
        }
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    return (
        <PageContainer onContextMenu={handleContextMenu}>
            <ButtonsContainer>
                <Dialog
                    open={isDialogOpen}
                    hideBackdrop
                    onClose={() => setDialogOpen(false)}
                >
                    <DialogContent>
                        <Box
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                mb: 2,
                            }}
                        >
                            <DialogTabs
                                value={currentDialogTab}
                                onChange={(_event, newValue) =>
                                    setCurrentDialogTab(newValue)
                                }
                            >
                                <Tab label="Stroke" />
                                <Tab label="Background" />
                            </DialogTabs>
                        </Box>
                        <div hidden={currentDialogTab !== 0}>
                            <BrushPreview
                                strokeWidth={strokeWidth}
                                color={color}
                            />
                            <Slider
                                value={strokeWidth}
                                onChange={updateStrokeWidth}
                                min={2}
                                max={30}
                            />

                            <ChromePicker
                                color={color}
                                onChange={updateColor}
                            />
                        </div>
                        <div hidden={currentDialogTab !== 1}>
                            <ChromePicker
                                color={backgroundColor}
                                onChange={updateBackgroundColor}
                            />
                        </div>
                    </DialogContent>
                </Dialog>

                <>
                    <Menu
                        open={contextMenu !== null}
                        onClose={handleClose}
                        onClick={handleClose}
                        anchorReference="anchorPosition"
                        anchorPosition={
                            contextMenu !== null
                                ? {
                                      top: contextMenu.mouseY,
                                      left: contextMenu.mouseX,
                                  }
                                : undefined
                        }
                    >
                        <MenuItem
                            onClick={() =>
                                selectTool(FabricDrawingToolId.Select)
                            }
                            sx={{ width: '260px' }}
                        >
                            <ListItemIcon>
                                <FontAwesomeIcon
                                    icon={faMousePointer}
                                    fixedWidth
                                />
                            </ListItemIcon>
                            <ListItemText>Select</ListItemText>
                            <Typography variant="body2">Space</Typography>
                        </MenuItem>
                        <MenuItem
                            onClick={() =>
                                selectTool(FabricDrawingToolId.Pencil)
                            }
                        >
                            <ListItemIcon>
                                <FontAwesomeIcon icon={faPen} fixedWidth />
                            </ListItemIcon>
                            <ListItemText>Draw</ListItemText>
                            <Typography variant="body2">1</Typography>
                        </MenuItem>
                        <MenuItem
                            onClick={() =>
                                selectTool(FabricDrawingToolId.LineArrow)
                            }
                        >
                            <ListItemIcon>
                                <FontAwesomeIcon
                                    icon={faArrowRight}
                                    fixedWidth
                                />
                            </ListItemIcon>
                            <ListItemText>Arrow</ListItemText>
                            <Typography variant="body2">2</Typography>
                        </MenuItem>
                        <MenuItem
                            onClick={() =>
                                selectTool(FabricDrawingToolId.Circle)
                            }
                        >
                            <ListItemIcon>
                                <FontAwesomeIcon icon={faCircle} fixedWidth />
                            </ListItemIcon>
                            <ListItemText>Circle</ListItemText>
                            <Typography variant="body2">3</Typography>
                        </MenuItem>
                        <MenuItem
                            onClick={() =>
                                selectTool(FabricDrawingToolId.Rectangle)
                            }
                        >
                            <ListItemIcon>
                                <FontAwesomeIcon icon={faSquare} fixedWidth />
                            </ListItemIcon>
                            <ListItemText>Rectangle</ListItemText>
                            <Typography variant="body2">4</Typography>
                        </MenuItem>
                        <MenuItem
                            onClick={() => selectTool(FabricDrawingToolId.Text)}
                        >
                            <ListItemIcon>
                                <FontAwesomeIcon icon={faFont} fixedWidth />
                            </ListItemIcon>
                            <ListItemText>Text</ListItemText>
                            <Typography variant="body2">T</Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={clearAll}>
                            <ListItemIcon>
                                <FontAwesomeIcon icon={faTrash} fixedWidth />
                            </ListItemIcon>
                            <ListItemText>Clear</ListItemText>
                            <Typography variant="body2">
                                Shift + Delete
                            </Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => setDialogOpen(true)}>
                            <ListItemIcon>
                                <FontAwesomeIcon icon={faCog} fixedWidth />
                            </ListItemIcon>
                            <ListItemText>Configurations</ListItemText>
                            <Typography variant="body2"></Typography>
                        </MenuItem>
                    </Menu>
                </>
            </ButtonsContainer>
            <FabricJSCanvas className="sample-canvas" onReady={onReady} />
        </PageContainer>
    );
}
