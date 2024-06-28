import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, IconButton, TableContainer, TableHead, TableRow, Paper, CircularProgress, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, Box, InputLabel } from '@mui/material';
import getProjets from '../../api/getProjets';
import getChercheurs from '../../api/getChercheurs';
import deleteChercheurs from '../../api/deleteChercheurs';
import putChercheurs from '../../api/putChercheurs';
import postChercheurs from '../../api/postChercheurs';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import UpdateIcon from '@mui/icons-material/Update';
import MultipleSelectChip from '../select/MultipleSelectChip';
import Alert from '@mui/material/Alert';

const TableDataChercheur = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chercheurs, setChercheurs] = useState([]);
    const [projets, setProjets] = useState([]);
    const [sortColumn, setSortColumn] = useState('nom');
    const [sortOrder, setSortOrder] = useState('asc');
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [selectedChercheur, setSelectedChercheur] = useState(null);
    const isAuthenticated = localStorage.getItem("token");

    const getData = () => {
        Promise.all([
            getProjets(isAuthenticated),
            getChercheurs(isAuthenticated)
        ])
        .then(([projetsData, chercheursData]) => {
            setProjets(projetsData);
            setChercheurs(chercheursData);
            setLoading(false);
        })
        .catch((err) => {
            setError(err.message);
            setLoading(false);
        });
    };

    useEffect(() => {
        getData();
    }, [isAuthenticated]);

    const handleRemoveClick = (chercheur) => {
        deleteChercheurs(isAuthenticated, chercheur.id)
            .then(() => {
                window.alert(chercheur.nom + " a été supprimé avec succès");
                getData();
            })
            .catch((err) => {
                window.alert("Erreur : " + err);
            });
    };

    const handleSort = (column) => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(newSortOrder);
    };

    const handleUpdateClick = (chercheur) => {
        setSelectedChercheur(chercheur);
        setOpenUpdateDialog(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedData = [...chercheurs].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
        setSelectedChercheur(null);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    };

    const handleCreateChercheur = () => {
        if (selectedChercheur) {
            console.log(selectedChercheur)
            postChercheurs(isAuthenticated, selectedChercheur)
                .then(() => {
                    window.alert(selectedChercheur.nom + " a été créé avec succès");
                    handleCloseCreateDialog();
                    getData();
                })
                .catch((err) => {
                    window.alert("Erreur : " + err);
                });
        }
    };

    const handleOpenUpdateDialog = () => {
        setOpenUpdateDialog(true);
    };

    const handleCloseUpdateDialog = () => {
        setOpenUpdateDialog(false);
        setSelectedChercheur(null);
    };

    const handleUpdateChercheur = () => {
        if (selectedChercheur) {
            putChercheurs(isAuthenticated, selectedChercheur)
                .then(() => {
                    window.alert(selectedChercheur.nom + " a été mis à jour avec succès");
                    handleCloseUpdateDialog();
                    getData();
                })
                .catch((err) => {
                    window.alert("Erreur : " + err);
                });
        }
    };

    return (
        <div>
            <h1>Chercheurs</h1>
            <p>Vous pouvez trier les éléments en cliquant sur la colonne</p>
            {error && <p>{error}</p>}
            {!loading ?  (
                <>
                    <Alert severity="warning">Touts les champs sont obligatoire lors de la création et l'update sauf pour <b>projets</b>.</Alert>
                    <Button variant="outlined" color="success" onClick={handleOpenCreateDialog}>
                        Créer
                    </Button>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell onClick={() => handleSort('nom')}><b>nom</b></TableCell>
                                    <TableCell onClick={() => handleSort('specialite')}><b>specialite</b></TableCell>
                                    <TableCell onClick={() => handleSort('projets')}><b>projets</b></TableCell>
                                    <TableCell><b>actions</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((chercheur) => (
                                    <TableRow key={chercheur.id}>
                                        <TableCell>{chercheur.nom}</TableCell>
                                        <TableCell>{chercheur.specialite}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {projets && chercheur && chercheur.projets.map((projet) => {
                                                    const unProjetChercheur = projets.find((unProjet) => unProjet.id == projet)
                                                    return(
                                                        <Chip key={unProjetChercheur.id} label={unProjetChercheur.titre} />
                                                    )
                                                })}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleUpdateClick(chercheur)}>
                                                <UpdateIcon color='warning' />
                                            </IconButton>
                                            <IconButton onClick={() => handleRemoveClick(chercheur)}>
                                                <RemoveCircleOutlineIcon color="error" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={sortedData.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[3, 5, 10]}
                    />

                    <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                        <DialogTitle>Créer un chercheur</DialogTitle>
                        <DialogContent>
                            <form>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="nom"
                                    label="Nom"
                                    fullWidth
                                    value={selectedChercheur ? selectedChercheur.nom : ''}
                                    onChange={(e) => setSelectedChercheur({ ...selectedChercheur, nom: e.target.value })}
                                />
                                <TextField
                                    margin="dense"
                                    id="specialite"
                                    label="Spécialité"
                                    fullWidth
                                    value={selectedChercheur ? selectedChercheur.specialite : ''}
                                    onChange={(e) => setSelectedChercheur({ ...selectedChercheur, specialite: e.target.value })}
                                />
                                <div style={{ marginBottom: '1rem' }}>
                                    <InputLabel id="projets-label">Projets</InputLabel>
                                    <MultipleSelectChip
                                        data={projets}
                                        selectedChercheur={ selectedChercheur ? selectedChercheur.projets : ''}
                                        setSelectedChercheur={(selected) => setSelectedChercheur({ ...selectedChercheur, projets: selected })}
                                    />
                                </div>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseCreateDialog} color="secondary">
                                Annuler
                            </Button>
                            <Button onClick={handleCreateChercheur} color="primary">
                                Créer
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
                        <DialogTitle>Mettre à jour le chercheur</DialogTitle>
                        <DialogContent>
                            <form>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="nom"
                                    label="Nom"
                                    fullWidth
                                    value={selectedChercheur ? selectedChercheur.nom : ''}
                                    onChange={(e) => setSelectedChercheur({ ...selectedChercheur, nom: e.target.value })}
                                />
                                <TextField
                                    margin="dense"
                                    id="specialite"
                                    label="Spécialité"
                                    fullWidth
                                    value={selectedChercheur ? selectedChercheur.specialite : ''}
                                    onChange={(e) => setSelectedChercheur({ ...selectedChercheur, specialite: e.target.value })}
                                />
                                <div style={{ marginBottom: '1rem' }}>
                                    <InputLabel id="projets-label">Projets</InputLabel>
                                    <MultipleSelectChip
                                        data={projets}
                                        selectedChercheur={ selectedChercheur ? selectedChercheur.projets : ''}
                                        setSelectedChercheur={(selected) => setSelectedChercheur({ ...selectedChercheur, projets: selected })}
                                    />
                                </div>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseUpdateDialog} color="secondary">
                                Annuler
                            </Button>
                            <Button onClick={handleUpdateChercheur} color="primary">
                                Mettre à jour
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            ):(
                <CircularProgress />
            )}
        </div>
    );
};

export default TableDataChercheur;
